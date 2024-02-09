// Constant Enums
const CHESS_PIECE = Object.freeze({
    NOTHING: 0,
    WHITE_KING: 1,
    WHITE_QUEEN: 2,
    WHITE_ROOK: 3,
    WHITE_BISHOP: 4,
    WHITE_KNIGHT: 5,
    WHITE_PAWN: 6,
    BLACK_KING: -1,
    BLACK_QUEEN: -2,
    BLACK_ROOK: -3,
    BLACK_BISHOP: -4,
    BLACK_KNIGHT: -5,
    BLACK_PAWN: -6
});

const COLOR = Object.freeze({
    WHITE: 0,
    BLACK: 1
})

// Global Variables - Data
const letters = "abcdefgh".split("");
const nums = "87654321".split("");
let position;
let turn = COLOR.WHITE;
let game_over = false;
let board_flipped = false;
let selected_ind = -1;
let notations = [];

// Global Variables - DOM
let chess_board;
let chess_squares = [];
let reset_button;
let flip_button;
let draw_button;
let resign_button;
let notation_table;

// Functions - Inits
function init() {
    get_html_elements();
    reset_game();
    add_square_listeners();
    add_button_listeners();
    render();
}

function start_chess_game(){

}

function stop_chess_game(){

}

function get_html_elements() {
    chess_board = document.getElementsByClassName("chess-board")[0];
    chess_squares = [];
    for(let i = 0; i < 8; i++) {
        let rank_element = chess_board.children[i];
        chess_squares = chess_squares.concat(Array.from(rank_element.children));
    }
    reset_button = document.getElementsByClassName("reset-game-button")[0];
    flip_button = document.getElementsByClassName("flip-board-button")[0];
    draw_button = document.getElementsByClassName("offer-draw-button")[0];
    resign_button = document.getElementsByClassName("resign-button")[0];

    notation_table = document.getElementsByClassName("chess-notation")[0];
}

function add_square_listeners() {
    for(let i = 0; i < chess_squares.length; i++) {
        chess_squares[i].addEventListener("click", on_click_square);
        chess_squares[i].addEventListener("contextmenu", on_click_square);
    }
}

function add_button_listeners() {
    reset_button.addEventListener("click", reset_game);
    flip_button.addEventListener("click", flip_board);
    draw_button.addEventListener("click", offer_draw);
    resign_button.addEventListener("click", resign);
}

// Functions - Rendering
function render() {
    show_position();
    show_selected_ind();
    show_hints();
    show_notations();
}

function show_position() {
    for(let i = 0; i < chess_squares.length; i++) {
        curr_piece= position[i]
        curr_square = chess_squares[i]

        while(curr_square.firstChild) {
            curr_square.removeChild(curr_square.lastChild);
        }

        if(curr_piece === CHESS_PIECE.NOTHING) {
            continue;
        }

        icon = document.createElement("img");
        icon.setAttribute("src", get_icon_file(curr_piece));
        icon.setAttribute("class", "piece-icon");
        curr_square.appendChild(icon);
    }
}

function show_selected_ind() {
    for(let i = 0; i < chess_squares.length; i++) {
        chess_squares[i].classList.remove("selected");
    }
    if(selected_ind >= 0) {
        chess_squares[selected_ind].classList.add("selected");
    }
}

function show_hints() {

}

function show_notations() {
    while(notation_table.firstChild) { // Clear notation table
        notation_table.removeChild(notation_table.lastChild);
    }

    // Put all notations in notation table
    every_other = true;
    move_num = 1;
    for(let i = 0; i < notations.length; i++) {
        if(every_other) {
            move_num_p = document.createElement("p");
            move_num_p.innerHTML = move_num + ".";
            move_num_p.classList.add("notation-move-num");
            notation_table.appendChild(move_num_p);
            move_num++;
        }
        every_other = ! every_other;

        move_p = document.createElement("p");
        move_p.innerHTML = notations[i];
        move_p.classList.add("notation-move");
        notation_table.appendChild(move_p);
    }
}

// Functions - Event Listeners
function on_click_square(e) {
    if(e.button === 2) { //right click to hl a square
        if(e.currentTarget.classList.contains("hl")) {
            e.currentTarget.classList.remove("hl");
        } else {
            e.currentTarget.classList.add("hl");
        }
    }else if(! game_over) { //left click to select a piece
        let ind = chess_squares.indexOf(e.currentTarget);

        if(is_my_piece(position, ind, turn)) { // if piece is same color as current turn, select it
            selected_ind = ind;
        } else {// otherwise, attempt to move the selected piece
            position = move_piece(position, selected_ind, ind, turn);
        }
    }

    render();
}

// Functions - Helpers
function get_icon_file(piece) {
    switch(curr_piece) {
        case CHESS_PIECE.WHITE_KING: return "icons/kl.svg";
        case CHESS_PIECE.WHITE_QUEEN: return "icons/ql.svg";
        case CHESS_PIECE.WHITE_ROOK: return "icons/rl.svg";
        case CHESS_PIECE.WHITE_BISHOP: return "icons/bl.svg";
        case CHESS_PIECE.WHITE_KNIGHT: return "icons/nl.svg";
        case CHESS_PIECE.WHITE_PAWN: return "icons/pl.svg";
        case CHESS_PIECE.BLACK_KING: return "icons/kd.svg";
        case CHESS_PIECE.BLACK_QUEEN: return "icons/qd.svg";
        case CHESS_PIECE.BLACK_ROOK: return "icons/rd.svg";
        case CHESS_PIECE.BLACK_BISHOP: return "icons/bd.svg";
        case CHESS_PIECE.BLACK_KNIGHT: return "icons/nd.svg";
        case CHESS_PIECE.BLACK_PAWN: return "icons/pd.svg";
    }
    return null;
}

function move_piece(position, orig, dest, turn) {
    if(orig === -1 || game_over) {
        return position;
    }

    new_position = position.concat();

    if(is_legal_move(new_position, orig, dest, turn)) {
        new_notation = generate_notation(new_position, orig, dest);
        add_notation(new_notation);
        new_position[dest] = new_position[orig];
        new_position[orig] = CHESS_PIECE.NOTHING;
        enemy_turn = (turn === COLOR.WHITE) ? COLOR.BLACK : COLOR.WHITE;
        if(is_check(new_position, enemy_turn)){
            if(is_checkmate(new_position, enemy_turn)) {
                winning_color = (turn === COLOR.WHITE) ? "White" : "Black";
                //alert(`Checkmate! $(winning_color) wins!`);
                alert(`Checkmate! ${winning_color} wins!`);
                game_over = true;
                return new_position;
            }
            alert("Check!");
        }
        swap_turn();
    }

    selected_ind = -1;

    return new_position;
}

function swap_turn() {
    turn = (turn === COLOR.WHITE) ? COLOR.BLACK : COLOR.WHITE;
}

function flip_board() {
    board_flipped = ! board_flipped;
    render();
}

function reset_game() {
    position = 
    [
        CHESS_PIECE.BLACK_ROOK, CHESS_PIECE.BLACK_KNIGHT, CHESS_PIECE.BLACK_BISHOP, CHESS_PIECE.BLACK_QUEEN, CHESS_PIECE.BLACK_KING, CHESS_PIECE.BLACK_BISHOP, CHESS_PIECE.BLACK_KNIGHT, CHESS_PIECE.BLACK_ROOK,
        CHESS_PIECE.BLACK_PAWN, CHESS_PIECE.BLACK_PAWN,   CHESS_PIECE.BLACK_PAWN,   CHESS_PIECE.BLACK_PAWN,  CHESS_PIECE.BLACK_PAWN, CHESS_PIECE.BLACK_PAWN,   CHESS_PIECE.BLACK_PAWN,   CHESS_PIECE.BLACK_PAWN, 
        CHESS_PIECE.NOTHING,    CHESS_PIECE.NOTHING,      CHESS_PIECE.NOTHING,      CHESS_PIECE.NOTHING,     CHESS_PIECE.NOTHING,    CHESS_PIECE.NOTHING,      CHESS_PIECE.NOTHING,      CHESS_PIECE.NOTHING,
        CHESS_PIECE.NOTHING,    CHESS_PIECE.NOTHING,      CHESS_PIECE.NOTHING,      CHESS_PIECE.NOTHING,     CHESS_PIECE.NOTHING,    CHESS_PIECE.NOTHING,      CHESS_PIECE.NOTHING,      CHESS_PIECE.NOTHING,
        CHESS_PIECE.NOTHING,    CHESS_PIECE.NOTHING,      CHESS_PIECE.NOTHING,      CHESS_PIECE.NOTHING,     CHESS_PIECE.NOTHING,    CHESS_PIECE.NOTHING,      CHESS_PIECE.NOTHING,      CHESS_PIECE.NOTHING,
        CHESS_PIECE.NOTHING,    CHESS_PIECE.NOTHING,      CHESS_PIECE.NOTHING,      CHESS_PIECE.NOTHING,     CHESS_PIECE.NOTHING,    CHESS_PIECE.NOTHING,      CHESS_PIECE.NOTHING,      CHESS_PIECE.NOTHING,
        CHESS_PIECE.WHITE_PAWN, CHESS_PIECE.WHITE_PAWN,   CHESS_PIECE.WHITE_PAWN,   CHESS_PIECE.WHITE_PAWN,  CHESS_PIECE.WHITE_PAWN, CHESS_PIECE.WHITE_PAWN,   CHESS_PIECE.WHITE_PAWN,   CHESS_PIECE.WHITE_PAWN,
        CHESS_PIECE.WHITE_ROOK, CHESS_PIECE.WHITE_KNIGHT, CHESS_PIECE.WHITE_BISHOP, CHESS_PIECE.WHITE_QUEEN, CHESS_PIECE.WHITE_KING, CHESS_PIECE.WHITE_BISHOP, CHESS_PIECE.WHITE_KNIGHT, CHESS_PIECE.WHITE_ROOK
    ];
    turn = COLOR.WHITE;
    board_flipped = false;
    game_over = false;
    selected_ind = -1;
    notations = [];
    render();
}

function offer_draw() {

}

function resign() {
    winning_color = (turn === COLOR.WHITE) ? "Black" : "White";
    alert(`Game Over! ${winning_color} wins!`);
    reset_game();
}

function get_all_legal_moves(position, turn) {
    let legal_moves = []
    for(let i = 0; i < position.length; i++) {
        legal_moves_for_i = get_legal_moves(position, i, turn)
        for(let j = 0; j < legal_moves_for_i.length; j++) {
            legal_moves.push([i, legal_moves_for_i[j]]);
        }
    }
    return legal_moves;
}

function get_legal_moves(position, ind, turn) {
    let legal_moves = [];
    // Nothing or Enemy
    if(! is_my_piece(position, ind, turn)) {
        legal_moves = [];
    } 
    // White Pawn
    else if(position[ind] == CHESS_PIECE.WHITE_PAWN) {
        // Forward moves
        if(position[translate(ind, 0, -1)] == CHESS_PIECE.NOTHING){
            legal_moves.push(translate(ind, 0, -1));
        }
        if(47 < ind && ind < 56) { // if on original space
            if(position[translate(ind, 0, -2)] == CHESS_PIECE.NOTHING){
                legal_moves.push(translate(ind, 0, -2));
            }
        }
        
        // Diagonal Moves
        if(is_enemy_piece(position, translate(ind, 1, -1), turn)) {
            legal_moves.push(translate(ind, 1, -1));
        }
        if(is_enemy_piece(position, translate(ind, -1, -1), turn)) {
            legal_moves.push(translate(ind, -1, -1));
        }
    }
    
    else if(position[ind] == CHESS_PIECE.BLACK_PAWN) { // Black Pawn
        // Forward moves
        if(position[translate(ind, 0, 1)] == CHESS_PIECE.NOTHING){
            legal_moves.push(translate(ind, 0, 1));
        }
        if(7 < ind && ind < 16) { // if on original space
            if(position[translate(ind, 0, 2)] == CHESS_PIECE.NOTHING){
                legal_moves.push(translate(ind, 0, 2));
            }
        } 
        
        // Diagonal Moves
        if(is_enemy_piece(position, translate(ind, 1, 1), turn)) {
            legal_moves.push(translate(ind, 1, 1));
        }
        if(is_enemy_piece(position, translate(ind, -1, 1), turn)) {
            legal_moves.push(translate(ind, -1, 1));
        }
    }
    // Knight
    else if(position[ind] == CHESS_PIECE.WHITE_KNIGHT || position[ind] == CHESS_PIECE.BLACK_KNIGHT) {
        let pairs = [[1, 2], [-1, 2], [1, -2], [-1, -2]]
        for(let i = 0; i < pairs.length; i++) {
            for(let flip = 0; flip <= 1; flip++) {
                let dest = translate(ind, pairs[i][flip], pairs[i][(flip + 1) % 2])
                if(dest == -1) {
                    continue;
                }
                if(is_my_piece(position, dest, turn)) {
                    continue;
                }
                legal_moves.push(dest);
            }
        }
    }
    // Bishop
    else if(position[ind] == CHESS_PIECE.WHITE_BISHOP || position[ind] == CHESS_PIECE.BLACK_BISHOP) {
        for(let xdiff = -1; xdiff <= 1; xdiff += 2){
            for(let ydiff = -1; ydiff <= 1; ydiff += 2){
                dest = translate(ind, xdiff, ydiff)
                while(dest != -1){
                    if(is_my_piece(position, dest, turn)){
                        break;
                    }
                    legal_moves.push(dest);
                    if(is_enemy_piece(position, dest, turn)){
                        break;
                    }
                    dest = translate(dest, xdiff, ydiff);
                }
            }
        }
    }
    // Rook
    else if(position[ind] == CHESS_PIECE.WHITE_ROOK || position[ind] == CHESS_PIECE.BLACK_ROOK) {
        for(let xdiff = -1; xdiff <= 1; xdiff += 1){
            dest = translate(ind, xdiff, 0)
            while(dest != -1){
                if(is_my_piece(position, dest, turn)){
                    break;
                }
                legal_moves.push(dest);
                if(is_enemy_piece(position, dest, turn)){
                    break;
                }
                dest = translate(dest, xdiff, 0);
            }
        }
        for(let ydiff = -1; ydiff <= 1; ydiff += 1){
            dest = translate(ind, 0, ydiff)
            while(dest != -1){
                if(is_my_piece(position, dest, turn)){
                    break;
                } legal_moves.push(dest);
                if(is_enemy_piece(position, dest, turn)){
                    break;
                }
                dest = translate(dest, 0, ydiff);
            }
        }
    }
    // Queen
    else if(position[ind] == CHESS_PIECE.WHITE_QUEEN || position[ind] == CHESS_PIECE.BLACK_QUEEN) {
        for(let xdiff = -1; xdiff <= 1; xdiff += 1){
            for(let ydiff = -1; ydiff <= 1; ydiff += 1){
                dest = translate(ind, xdiff, ydiff)
                while(dest != -1){
                    if(is_my_piece(position, dest, turn)){
                        break;
                    }
                    legal_moves.push(dest);
                    if(is_enemy_piece(position, dest, turn)){
                        break;
                    }
                    dest = translate(dest, xdiff, ydiff);
                }
            }
        }
    }
    // King
    else if(position[ind] == CHESS_PIECE.WHITE_KING || position[ind] == CHESS_PIECE.BLACK_KING) {
        for(let xdiff = -1; xdiff <= 1; xdiff += 1){
            for(let ydiff = -1; ydiff <= 1; ydiff += 1){
                dest = translate(ind, xdiff, ydiff)
                if(dest != -1 && ! is_my_piece(position, dest, turn)){
                    legal_moves.push(dest);
                }
            }
        }
    }

    // TODO: If in Check, remove all options that don't remove check
    new_legal_moves = []
    for(let i = 0; i < legal_moves.length; i++) {
        dest = legal_moves[i];
        proto_position = position.concat();
        proto_position[dest] = proto_position[ind];
        proto_position[ind] = CHESS_PIECE.NOTHING;
        opposite_turn = (turn === COLOR.WHITE) ? COLOR.BLACK : COLOR.WHITE;

        if(! is_check(proto_position, turn)) {
            new_legal_moves.push(dest);
        }
    }
    return new_legal_moves;
    //return legal_moves;
}

function translate(orig, x, y) {
    let orig_x = orig % 8;
    let orig_y = Math.floor(orig / 8);

    let dest_x = orig_x + x;
    let dest_y = orig_y + y

    if( dest_x > 7 || dest_x < 0 || dest_y > 7 || dest_y < 0) {
        return -1;
    }

    let dest = dest_x + dest_y * 8;
    return dest;
}

function pos_to_ind(x, y) {
    dest = x + 8*y;
    if(0 <= dest && dest <= 63) {
        return dest;
    }
    return -1;
}

function ind_to_pos(ind) {
    if(0 <= ind && ind <= 63) {
        return [ind % 8, Math.floor(ind / 8)];
    }
    return -1;
}

function generate_notation(position, orig, dest) {
    orig_pos = ind_to_pos(orig);
    dest_pos = ind_to_pos(dest);

    orig_notation = letters[orig_pos[0]] + nums[orig_pos[1]];
    dest_notation = letters[dest_pos[0]] + nums[dest_pos[1]];

    if(is_pawn(position, orig)) {
        if(is_empty(position, dest)) {
            return dest_notation;
        }else {
            return orig_notation[0] + "x" + dest_notation
        }
    }
    if(is_knight(position, orig)) {
        if(is_empty(position, dest)) {
            return "N" + dest_notation;
        }else {
            return "Nx" + dest_notation
        }
    }
    if(is_bishop(position, orig)) {
        if(is_empty(position, dest)) {
            return "B" + dest_notation;
        }else {
            return "Bx" + dest_notation
        }
    }
    if(is_rook(position, orig)) {
        if(is_empty(position, dest)) {
            return "R" + dest_notation;
        }else {
            return "Rx" + dest_notation
        }
    }
    if(is_queen(position, orig)) {
        if(is_empty(position, dest)) {
            return "Q" + dest_notation;
        }else {
            return "Qx" + dest_notation;
        }
    }
    if(is_king(position, orig)) {
        if(is_empty(position, dest)) {
            return "K" + dest_notation;
        }else {
            return "Kx" + dest_notation
        }
    }
}

function add_notation(text) {
    notations.push(text);
    render();
}

function pawns_moves(position, ind, color) {
    
}

function knights_moves(position, ind) {

}

function bishops_moves(position, ind) {

}

function rooks_moves(position, ind) {

}

function queens_moves(position, ind) {

}

function kings_moves(position, ind) {

}

// Functions - Booleans
function is_check(position, turn) {
    // Find King
    king_piece = (turn == COLOR.WHITE) ? CHESS_PIECE.WHITE_KING : CHESS_PIECE.BLACK_KING;
    king_ind = -1;
    for(let i = 0; i < position.length; i++) {
        if(position[i] == king_piece) {
            king_ind = i;
            break;
        }
    }
    // Check in each of the 8 directions
    for(let xdiff = -1; xdiff <= 1; xdiff++) { // 
        for(let ydiff = -1; ydiff <= 1; ydiff++) { // 
            for(let dist = 1; dist <= 8; dist++) { // 
                ind = translate(king_ind, dist*xdiff, dist*ydiff);
                if(ind === -1) { // Break if off the board
                    break;
                }
                if(is_my_piece(position, ind, turn)) { // Break if ran into friend
                    break;
                }
                if(is_empty(position, ind)) { // Continue if empty
                    continue;
                }

                // Check various pieces
                if(is_pawn(position, ind)) {
                    if(turn === COLOR.WHITE) { // Pawn is Black
                        if(ydiff === -1 && xdiff != 0) {
                            return true;
                        }
                    } else { // Pawn is white
                        if(ydiff ===  1 && xdiff != 0) {
                            return true;
                        }
                    }
                    break; 
                }
                if(is_bishop(position, ind)) {
                    if(Math.abs(ydiff) === Math.abs(xdiff)) {
                        return true;
                    }
                    break; 
                }
                if(is_rook(position, ind)) {
                    if(xdiff === 0 || ydiff === 0) {
                        return true;
                    }
                    break; 
                }
                if(is_queen(position, ind)) {
                    return true;
                }
            }
        }
    }
    // Check at each knight's move away
    let pairs = [[1, 2], [-1, 2], [1, -2], [-1, -2]]
    for(let i = 0; i < pairs.length; i++) {
        for(let flip = 0; flip <= 1; flip++) {
            let ind = translate(king_ind, pairs[i][flip], pairs[i][(flip + 1) % 2])
            if(ind == -1) {
                continue;
            }
            if(is_my_piece(position, ind, turn)) {
                continue;
            }
            if(is_knight(position, ind)) {
                return true;
            }
        }
    }


    /*
    legal_moves = get_all_legal_moves(position, turn);
    for(let i = 0; i < legal_moves.length; i++) {
        legal_moves_for_this_piece = legal_moves[i];
        for(let j = 0; j < legal_moves_for_this_piece.length; j++) {
            piece_on_dest_square = position[legal_moves_for_this_piece[j]];
            is_black_king = piece_on_dest_square == CHESS_PIECE.BLACK_KING
            is_white_king = piece_on_dest_square == CHESS_PIECE.WHITE_KING
            if(turn === COLOR.WHITE && is_white_king){
                return true;
            }
            if(turn === COLOR.BLACK && is_black_king){
                return true;
            }
        }
    } */

    return false;
}

function is_checkmate(position, turn) {
    if(is_check(position, turn) && get_all_legal_moves(position, turn).length == 0) {
        return true;
    }
    return false;
}

function is_legal_move(position, orig, dest, turn) {
    return get_legal_moves(position, orig, turn).includes(dest);
}

function is_my_piece(position, ind, turn) {
    if(ind < 0 || ind > 63) {
        return false;
    }
    if(turn === COLOR.WHITE) {
        return (
               position[ind] === CHESS_PIECE.WHITE_PAWN
            || position[ind] === CHESS_PIECE.WHITE_KNIGHT
            || position[ind] === CHESS_PIECE.WHITE_BISHOP
            || position[ind] === CHESS_PIECE.WHITE_ROOK
            || position[ind] === CHESS_PIECE.WHITE_QUEEN
            || position[ind] === CHESS_PIECE.WHITE_KING
        );
    } else {
        return (
               position[ind] === CHESS_PIECE.BLACK_PAWN
            || position[ind] === CHESS_PIECE.BLACK_KNIGHT
            || position[ind] === CHESS_PIECE.BLACK_BISHOP
            || position[ind] === CHESS_PIECE.BLACK_ROOK
            || position[ind] === CHESS_PIECE.BLACK_QUEEN
            || position[ind] === CHESS_PIECE.BLACK_KING
        );
    }
}

function is_enemy_piece(position, ind, turn) {
    if(ind < 0 || ind > 63) {
        return false;
    }
    if(turn === COLOR.WHITE) {
        return (
               position[ind] === CHESS_PIECE.BLACK_PAWN
            || position[ind] === CHESS_PIECE.BLACK_KNIGHT
            || position[ind] === CHESS_PIECE.BLACK_BISHOP
            || position[ind] === CHESS_PIECE.BLACK_ROOK
            || position[ind] === CHESS_PIECE.BLACK_QUEEN
            || position[ind] === CHESS_PIECE.BLACK_KING
        );
    } else {
        return (
               position[ind] === CHESS_PIECE.WHITE_PAWN
            || position[ind] === CHESS_PIECE.WHITE_KNIGHT
            || position[ind] === CHESS_PIECE.WHITE_BISHOP
            || position[ind] === CHESS_PIECE.WHITE_ROOK
            || position[ind] === CHESS_PIECE.WHITE_QUEEN
            || position[ind] === CHESS_PIECE.WHITE_KING
        );
    }
}

function is_pawn(position, ind) {
    if(position[ind] == CHESS_PIECE.BLACK_PAWN || position[ind] == CHESS_PIECE.WHITE_PAWN) {
        return true;
    }
    return false;
}

function is_knight(position, ind) {
    if(position[ind] == CHESS_PIECE.BLACK_KNIGHT || position[ind] == CHESS_PIECE.WHITE_KNIGHT) {
        return true;
    }
    return false;
}

function is_bishop(position, ind) {
    if(position[ind] == CHESS_PIECE.BLACK_BISHOP || position[ind] == CHESS_PIECE.WHITE_BISHOP) {
        return true;
    }
    return false;
}

function is_rook(position, ind) {
    if(position[ind] == CHESS_PIECE.BLACK_ROOK || position[ind] == CHESS_PIECE.WHITE_ROOK) {
        return true;
    }
    return false;
}

function is_queen(position, ind) {
    if(position[ind] == CHESS_PIECE.BLACK_QUEEN || position[ind] == CHESS_PIECE.WHITE_QUEEN) {
        return true;
    }
    return false;
}

function is_king(position, ind) {
    if(position[ind] == CHESS_PIECE.BLACK_KING || position[ind] == CHESS_PIECE.WHITE_KING) {
        return true;
    }
    return false;
}

function is_empty(position, ind) {
    if(position[ind] == CHESS_PIECE.NOTHING || position[ind] == CHESS_PIECE.NOTHING) {
        return true;
    }
    return false;
}

