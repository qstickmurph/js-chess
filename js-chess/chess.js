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
let current_position;
let current_turn = COLOR.WHITE;
let game_over = false;
let board_flipped = false;
let selected_ind = -1;
let last_played_move = [];
let notations = [];
let promoting = false;
let promoting_ind = -1;
let white_king_moved = false;
let white_a_rook_moved = false;
let white_h_rook_moved = false;
let black_king_moved = false;
let black_a_rook_moved = false;
let black_h_rook_moved = false;
let en_passantable = -1;

// Global Variables - DOM
let chess_board;
let chess_squares = [];
let reset_button;
let flip_button;
//let draw_button;
let resign_button;
let notation_table;
let pawn_promotion_table;
let pawn_promotion_knight;
let pawn_promotion_bishop;
let pawn_promotion_rook;
let pawn_promotion_queen;

// Functions - Inits
function init() {
    get_html_elements();
    reset_game();
    add_listeners();
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
    //draw_button = document.getElementsByClassName("offer-draw-button")[0];
    resign_button = document.getElementsByClassName("resign-button")[0];

    notation_table = document.getElementsByClassName("chess-notation")[0];

    pawn_promotion_table = document.getElementsByClassName("pawn-promotion-container")[0];
    pawn_promotion_knight = document.getElementsByClassName("pawn-promotion-icon knight")[0];
    pawn_promotion_bishop = document.getElementsByClassName("pawn-promotion-icon bishop")[0];
    pawn_promotion_rook = document.getElementsByClassName("pawn-promotion-icon rook")[0];
    pawn_promotion_queen = document.getElementsByClassName("pawn-promotion-icon queen")[0];
}

function add_listeners() {
    for(let i = 0; i < chess_squares.length; i++) {
        chess_squares[i].addEventListener("click", on_click_square);
        chess_squares[i].addEventListener("contextmenu", on_click_square);
    }

    reset_button.addEventListener("click", reset_game);
    flip_button.addEventListener("click", flip_board);
    //draw_button.addEventListener("click", offer_draw);
    resign_button.addEventListener("click", resign);

    pawn_promotion_knight.addEventListener("click", on_click_promotion_icon);
    pawn_promotion_bishop.addEventListener("click", on_click_promotion_icon);
    pawn_promotion_rook.addEventListener("click", on_click_promotion_icon);
    pawn_promotion_queen.addEventListener("click", on_click_promotion_icon);
}

// Functions - Rendering
function render() {
    show_board();
    show_notations();
}

function show_board() {
    for(let i = 0; i < chess_squares.length; i++) {
        curr_piece = current_position[i]
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

    for(let i = 0; i < chess_squares.length; i++) {
        chess_squares[i].classList.remove("selected");
    }
    if(selected_ind >= 0) {
        chess_squares[selected_ind].classList.add("selected");
    }
    for(let i = 0; i < last_played_move.length; i++) {
        chess_squares[last_played_move[i]].classList.add("selected");
    }

    let hint_moves = get_legal_moves(current_position, selected_ind, current_turn);
    for(let i = 0; i < hint_moves.length; i++) {
        hint_dot = document.createElement("span");
        hint_dot.setAttribute("class", "hint-dot");
        chess_squares[hint_moves[i]].appendChild(hint_dot);
    }
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
    if(promoting) { // Block moves while promoting
        return;
    }

    if(e.button === 2) { //right click to hl a square
        if(e.currentTarget.classList.contains("hl")) {
            e.currentTarget.classList.remove("hl");
        } else {
            e.currentTarget.classList.add("hl");
        }
    }else if(! game_over) { //left click to select a piece
        let ind = chess_squares.indexOf(e.currentTarget);

        if(is_my_piece(current_position, ind, current_turn)) { // if piece is same color as current turn, select it
            selected_ind = ind;
        } else {// otherwise, attempt to move the selected piece
            current_position = move_piece(current_position, selected_ind, ind, current_turn);
        }
    }

    render();
}

function on_click_promotion_icon(e) {
    let promotion_piece;
    if(current_turn == COLOR.WHITE) {
        switch(e.currentTarget.classList[1]) {
            case "knight": promotion_piece = CHESS_PIECE.WHITE_KNIGHT; break;
            case "bishop": promotion_piece = CHESS_PIECE.WHITE_BISHOP; break;
            case "rook": promotion_piece = CHESS_PIECE.WHITE_ROOK ; break;
            case "queen": promotion_piece = CHESS_PIECE.WHITE_QUEEN ; break;
        }
    } else {
        switch(e.currentTarget.classList[1]) {
            case "knight": promotion_piece = CHESS_PIECE.BLACK_KNIGHT; break;
            case "bishop": promotion_piece = CHESS_PIECE.BLACK_BISHOP; break;
            case "rook": promotion_piece = CHESS_PIECE.BLACK_ROOK ; break;
            case "queen": promotion_piece = CHESS_PIECE.BLACK_QUEEN ; break;
        }
    }
    current_position[promoting_ind] = promotion_piece;

    notation_char = ""
    switch(e.currentTarget.classList[1]) {
        case "knight": notation_char = "N";
        case "bishop": notation_char = "B";
        case "rook": notation_char = "R";
        case "queen": notation_char = "Q";
    }
    notations[notations.length - 1] += "=" + notation_char;

    enemy_turn = (current_turn === COLOR.WHITE) ? COLOR.BLACK : COLOR.WHITE;
    if(is_check(new_position, enemy_turn)){
        if(is_checkmate(new_position, enemy_turn)) {
            winning_color = (current_turn === COLOR.WHITE) ? "White" : "Black";
            alert(`Checkmate! ${winning_color} wins!`);
            game_over = true;
            return new_position;
        }
        alert("Check!");
    }
    swap_turn();

    promoting = false;
    pawn_promotion_table.style.visibility = "hidden";

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
        new_notation = generate_notation(new_position, orig, dest, turn);
        add_notation(new_notation);

        if(is_castle_move(position, orig, dest, turn)) {
            switch(dest) {
                case 2: 
                    new_position[dest] = CHESS_PIECE.BLACK_KING;
                    new_position[3]    = CHESS_PIECE.BLACK_ROOK;
                    new_position[orig] = CHESS_PIECE.NOTHING;
                    new_position[0]    = CHESS_PIECE.NOTHING;
                    break;
                case 6: 
                    new_position[dest] = CHESS_PIECE.BLACK_KING;
                    new_position[5]    = CHESS_PIECE.BLACK_ROOK;
                    new_position[orig] = CHESS_PIECE.NOTHING;
                    new_position[7]    = CHESS_PIECE.NOTHING;
                    break;
                case 58: 
                    new_position[dest] = CHESS_PIECE.WHITE_KING;
                    new_position[59]   = CHESS_PIECE.WHITE_ROOK;
                    new_position[orig] = CHESS_PIECE.NOTHING;
                    new_position[56]   = CHESS_PIECE.NOTHING;
                    break;
                case 62: 
                    new_position[dest] = CHESS_PIECE.WHITE_KING;
                    new_position[61]   = CHESS_PIECE.WHITE_ROOK;
                    new_position[orig] = CHESS_PIECE.NOTHING;
                    new_position[63]   = CHESS_PIECE.NOTHING;
                    break;
            }
        } else {
            new_position[dest] = new_position[orig];
            new_position[orig] = CHESS_PIECE.NOTHING;
        }

        // Remove enemy piece on en-passant
        if(is_en_passant(position, orig, dest, turn)) {
            dead_pawn_ind = (turn == COLOR.WHITE) ? translate(dest, 0, 1) : translate(dest, 0, -1);
            new_position[dead_pawn_ind] = CHESS_PIECE.NOTHING;
        }

        // Clears en_passantable
        en_passantable = -1;

        // Makes pawn en-passantable on double move
        if(is_pawn(position, orig)) {
            if(turn == COLOR.WHITE && dest == translate(orig, 0, -2)) {
                en_passantable = translate(orig, 0, -1);
            }
            if(turn == COLOR.BLACK && dest == translate(orig, 0,  2)) {
                en_passantable = translate(orig, 0, 1);
            }
        }

        // Check for pawn promotion
        if(is_pawn_promote(new_position, dest, turn)) {
            promote_pawn(new_position, dest, turn);
        }
        else { // Otherwise proceed
            enemy_turn = (turn === COLOR.WHITE) ? COLOR.BLACK : COLOR.WHITE;
            if(is_check(new_position, enemy_turn)){
                if(is_checkmate(new_position, enemy_turn)) {
                    winning_color = (turn === COLOR.WHITE) ? "White" : "Black";
                    alert(`Checkmate! ${winning_color} wins!`);
                    game_over = true;
                    return new_position;
                }
                alert("Check!");
            }
            swap_turn();
        }
        last_played_move = [orig, dest];

        // Set has_moved bools
        if(orig == 0) {
            black_a_rook_moved = true;
        }
        if(orig == 4) {
            black_king_moved = true;
        }
        if(orig == 7) {
            black_h_rook_moved = true;
        }
        if(orig == 56) {
            white_a_rook_moved = true;
        }
        if(orig == 60) {
            white_king_moved = true;
        }
        if(orig == 63) {
            white_h_rook_moved = true;
        }
    }

    selected_ind = -1;

    return new_position;
}

function swap_turn() {
    current_turn = (current_turn === COLOR.WHITE) ? COLOR.BLACK : COLOR.WHITE;
}

function flip_board() {
    board_flipped = ! board_flipped;
    render();
}

function reset_game() {
    current_position = 
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
    current_turn = COLOR.WHITE;
    board_flipped = false;
    game_over = false;
    selected_ind = -1;
    last_played_move = [];
    notations = [];
    promoting = false;
    promoting_ind = -1;
    white_king_moved = false;
    white_a_rook_moved = false;
    white_h_rook_move = false;
    black_king_moved = false;
    black_a_rook_moved = false;
    black_h_rook_moved = false;

    render();
}

function offer_draw() {

}

function resign() {
    winning_color = (current_turn === COLOR.WHITE) ? "Black" : "White";
    alert(`Game Over! ${winning_color} wins!`);
    reset_game();
}

function get_all_legal_moves(position, turn) {
    let all_legal_moves = []
    for(let i = 0; i < position.length; i++) {
        legal_moves_for_i = get_legal_moves(position, i, turn)
        for(let j = 0; j < legal_moves_for_i.length; j++) {
            all_legal_moves.push([i, legal_moves_for_i[j]]);
        }
    }
    return all_legal_moves;
}

function get_legal_moves(position, ind, turn) {
    let all_moves = [];
    // Nothing or Enemy
    if(! is_my_piece(position, ind, turn)) {
        return [];
    } 
    // Pawn
    if(is_pawn(position, ind)) {
        all_moves = pawn_moves(position, ind, turn);
    }
    // Knight
    if(is_knight(position, ind)) {
        all_moves = knight_moves(position, ind);
    }
    // Bishop
    if(is_bishop(position, ind)) {
        all_moves = bishop_moves(position, ind);
    }
    // Rook
    if(is_rook(position, ind)) {
        all_moves = rook_moves(position, ind);
    }
    // Queen
    if(is_queen(position, ind)) {
        all_moves = queen_moves(position, ind);
    }
    // King
    if(is_king(position, ind)) {
        all_moves = king_moves(position, ind);
        // Add castling king and queenside
        if(can_castle_kingside(position, turn)) {
            castle_ind = (turn == COLOR.WHITE) ? 62 : 6;
            all_moves.push(castle_ind);
        }
        if(can_castle_queenside(position, turn)) {
            castle_ind = (turn == COLOR.WHITE) ? 58 : 2;
            all_moves.push(castle_ind);
        }
    }

    // Remove illegal moves
    legal_moves = []
    for(let i = 0; i < all_moves.length; i++) {
        let dest = all_moves[i];

        if(is_my_piece(position, dest, turn)) {
            continue;
        }

        proto_position = position.concat();
        proto_position[dest] = proto_position[ind];
        proto_position[ind] = CHESS_PIECE.NOTHING;
        if(is_check(proto_position, turn)) {
            continue;
        }

        legal_moves.push(dest);
    }
    return legal_moves;
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
    let dest = x + 8*y;
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

function generate_notation(position, orig, dest, turn) {
    let orig_pos = ind_to_pos(orig);
    let dest_pos = ind_to_pos(dest);

    let piece_string = "";
    switch(position[orig]) {
        case CHESS_PIECE.BLACK_KNIGHT:
        case CHESS_PIECE.WHITE_KNIGHT:
            piece_string = "N";
            break;
        case CHESS_PIECE.BLACK_BISHOP:
        case CHESS_PIECE.WHITE_BISHOP:
            piece_string = "B";
            break;
        case CHESS_PIECE.BLACK_ROOK:
        case CHESS_PIECE.WHITE_ROOK:
            piece_string = "R";
            break;
        case CHESS_PIECE.BLACK_QUEEN:
        case CHESS_PIECE.WHITE_QUEEN:
            piece_string = "Q";
            break;
        case CHESS_PIECE.BLACK_KING:
        case CHESS_PIECE.WHITE_KING:
            piece_string = "K";
            break;
    }

    let orig_string = "";
    if(is_pawn(position, orig)) {
        if(! is_empty(position,dest) || is_en_passant(position, orig, dest, turn)) {
            orig_string = letters[orig_pos[0]];
        }
    } else if(is_knight(position, orig)) {
        knight_move_list = knight_moves(position, dest);
        let same_rank = false;
        let same_file = false;
        for(let i = 0; i < knight_move_list.length; i++) {
            check_ind = knight_move_list[i];
            if(check_ind == orig) { // Skip main knight
                continue;
            }
            if(is_my_piece(position, check_ind, turn) && is_knight(position, check_ind)) {
                check_pos = ind_to_pos(check_ind);
                if(orig_pos[0] == check_pos[0]) {
                    same_rank = true;
                }
                else if(orig_pos[1] == check_pos[1]) {
                    same_file = true;
                }
            }
        }

        if(same_rank) {
            orig_string += (letters[orig_pos[0]]);
        }
        if(same_file) {
            orig_string += (nums[orig_pos[1]]);
        }
    } else if(is_bishop(position, orig)) {
        bishop_move_list = bishop_moves(position, dest);
        let same_rank = false;
        let same_file = false;
        for(let i = 0; i < bishop_move_list.length; i++) {
            check_ind = bishop_move_list[i];
            if(check_ind == orig) { // Skip main bishop
                continue;
            }
            if(is_my_piece(position, check_ind, turn) && is_bishop(position, check_ind)) {
                check_pos = ind_to_pos(check_ind);
                if(orig_pos[0] == check_pos[0]) {
                    same_rank = true;
                }
                else if(orig_pos[1] == check_pos[1]) {
                    same_file = true;
                }
            }
        }

        if(same_rank) {
            orig_string += (letters[orig_pos[0]]);
        }
        if(same_file) {
            orig_string += (nums[orig_pos[1]]);
        }
    } else if(is_rook(position, orig)) {
        rook_move_list = rook_moves(position, dest);
        let same_rank = false;
        let same_file = false;
        for(let i = 0; i < rook_move_list.length; i++) {
            check_ind = rook_move_list[i];
            if(check_ind == orig) { // Skip main rook
                continue;
            }
            if(is_my_piece(position, check_ind, turn) && is_rook(position, check_ind)) {
                check_pos = ind_to_pos(check_ind);
                if(orig_pos[0] == check_pos[0]) {
                    same_rank = true;
                }
                else if(orig_pos[1] == check_pos[1]) {
                    same_file = true;
                }
            }
        }

        if(same_rank) {
            orig_string += (letters[orig_pos[0]]);
        }
        if(same_file) {
            orig_string += (nums[orig_pos[1]]);
        }
    } else if(is_queen(position, orig)) {
        queen_move_list = queen_moves(position, dest);
        let same_rank = false;
        let same_file = false;
        for(let i = 0; i < queen_move_list.length; i++) {
            check_ind = queen_move_list[i];
            if(check_ind == orig) { // Skip main queen
                continue;
            }
            if(is_my_piece(position, check_ind, turn) && is_queen(position, check_ind)) {
                check_pos = ind_to_pos(check_ind);
                if(orig_pos[0] == check_pos[0]) {
                    same_rank = true;
                }
                else if(orig_pos[1] == check_pos[1]) {
                    same_file = true;
                }
            }
        }

        if(same_rank) {
            orig_string += (letters[orig_pos[0]]);
        }
        if(same_file) {
            orig_string += (nums[orig_pos[1]]);
        }
    }

    let captures_string = ""
    if(! is_empty(position, dest) || is_en_passant(position, orig, dest, turn)) {
        captures_string = "x";
    }

    let dest_string = letters[dest_pos[0]] + nums[dest_pos[1]];

    let check_string = ""
    proto_position = position.concat();
    proto_position[dest] = proto_position[orig];
    proto_position[orig] = CHESS_PIECE.NOTHING;
    opposite_turn = (turn == COLOR.WHITE) ? COLOR.BLACK : COLOR.WHITE;
    if(is_check(proto_position, opposite_turn)) {
        check_string = "+";
        if(is_checkmate(proto_position, opposite_turn)) {
            check_string = "#";
        }
    }


    if(is_castle_move(position, orig, dest, turn)) {
        switch(dest) {
            case 6:
            case 62:
                return "O-O" + check_string;
            case 2:
            case 58:
                return "O-O-O" + check_string;
        }
    } 
    return piece_string + orig_string + captures_string + dest_string + check_string;
}

function add_notation(text) {
    notations.push(text);
    render();
}

function promote_pawn(position, ind) {
    promoting_ind = ind
    promoting = true;

    pawn_promotion_table.style.visibility = "visible";
}

function pawn_moves(position, ind, color) {
    let moves = [];
    let ydir = (color == COLOR.WHITE) ? -1 : 1

    // Forward moves
    if(is_empty(position, translate(ind, 0, ydir))){
        moves.push(translate(ind, 0, ydir));
    }
    if(   (color == COLOR.WHITE && 48 <= ind && ind <= 55)
       || (color == COLOR.BLACK **  8 <= ind && ind <= 15) ) { // if on original space
        if(is_empty(position, translate(ind, 0, 2*ydir))){
            moves.push(translate(ind, 0, 2*ydir));
        }
    }
    
    // Diagonal Moves
    if(is_enemy_piece(position, translate(ind, 1, ydir), color) || is_en_passant(position, ind, translate(ind, 1, ydir), color)) {
        moves.push(translate(ind, 1, ydir));
    }
    if(is_enemy_piece(position, translate(ind, -1, ydir), color) || is_en_passant(position, ind, translate(ind, -1, ydir), color)) {
        moves.push(translate(ind, -1, ydir));
    }
   
    return moves;
}

function pawn_captures_from_here(position, ind, color) {
    let origins = [];
    let ydir = (color == COLOR.WHITE) ? 1 : -1;
    for(let xdiff = -1; xdiff <= 1; xdiff += 2) {
        let dest = translate(ind, xdiff, ydir);
        if(dest == -1) {
            continue;
        }
        origins.push(dest);
    }

    return origins;
}

function knight_moves(position, ind) {
    let moves = [];
    let pairs = [[1, 2], [-1, 2], [1, -2], [-1, -2]]
    for(let i = 0; i < pairs.length; i++) {
        for(let flip = 0; flip <= 1; flip++) {
            let dest = translate(ind, pairs[i][flip], pairs[i][(flip + 1) % 2])
            if(dest == -1) {
                continue;
            }
            moves.push(dest);
        }
    }
    return moves;
}

function bishop_moves(position, ind) {
    moves = []
    for(let xdiff = -1; xdiff <= 1; xdiff += 2){
        for(let ydiff = -1; ydiff <= 1; ydiff += 2){
            dest = translate(ind, xdiff, ydiff)
            while(dest != -1){
                moves.push(dest);
                if(! is_empty(position, dest)){
                    break;
                }
                dest = translate(dest, xdiff, ydiff);
            }
        }
    }
    return moves;
}

function rook_moves(position, ind) {
    moves = []
    for(let xdiff = -1; xdiff <= 1; xdiff += 2){
        dest = translate(ind, xdiff, 0)
        while(dest != -1){
            moves.push(dest);
            if(! is_empty(position, dest)){
                break;
            }
            dest = translate(dest, xdiff, 0);
        }
    }
    for(let ydiff = -1; ydiff <= 1; ydiff += 2){
        dest = translate(ind, 0, ydiff)
        while(dest != -1){
            moves.push(dest);
            if(! is_empty(position, dest)){
                break;
            }
            dest = translate(dest, 0, ydiff);
        }
    }
    return moves;
}

function queen_moves(position, ind) {
    moves = [];
    for(let xdiff = -1; xdiff <= 1; xdiff += 1){
        for(let ydiff = -1; ydiff <= 1; ydiff += 1){
            if(xdiff == 0 && ydiff == 0){
                continue;
            }

            dest = translate(ind, xdiff, ydiff)
            while(dest != -1){
                moves.push(dest);
                if(! is_empty(position, dest)){
                    break;
                }
                dest = translate(dest, xdiff, ydiff);
            }
        }
    }
    return moves;
}

function king_moves(position, ind) {
    moves = [];
    for(let xdiff = -1; xdiff <= 1; xdiff += 1){
        for(let ydiff = -1; ydiff <= 1; ydiff += 1){
            dest = translate(ind, xdiff, ydiff)
            if(dest != -1){
                moves.push(dest);
            }
        }
    }
    return moves;
}

// Functions - Booleans
function is_check(position, turn) {
    // Find King
    let king_piece = (turn == COLOR.WHITE) ? CHESS_PIECE.WHITE_KING : CHESS_PIECE.BLACK_KING;
    let king_ind = -1;
    for(let i = 0; i < position.length; i++) {
        if(position[i] == king_piece) {
            king_ind = i;
            break;
        }
    }
    // Check all of the piece moves away
    let check_ind
    // Pawn moves (manual)
    let enemy_color = (turn == COLOR.WHITE) ? COLOR.BLACK : COLOR.WHITE;
    let pawn_move_list = pawn_captures_from_here(position, king_ind, enemy_color);
    for(let i = 0; i < pawn_move_list.length; i++) {
        check_ind = pawn_move_list[i];
        if(is_enemy_piece(position, check_ind, turn) && is_pawn(position, check_ind)) {
            return true;
        }
    }
    /*
    let enemy_pawn_ydiff = (turn == COLOR.WHITE) ? -1 : 1;
    for(let xdiff = -1; xdiff <= 1; xdiff += 2) {
        check_ind = translate(king_ind, xdiff, enemy_pawn_ydiff);
        if(check_ind == -1) {
            continue;
        }
        if(is_enemy_piece(position, check_ind, turn) && is_pawn(position, check_ind)){
            return true;
        }
    } */
    // Knight moves
    let knight_move_list = knight_moves(position, king_ind);
    for(let i = 0; i < knight_move_list.length; i++) {
        check_ind = knight_move_list[i];
        if(is_enemy_piece(position, check_ind, turn) && is_knight(position, check_ind)) {
            return true;
        }
    }
    // Bishop moves (or Queen)
    let bishop_move_list = bishop_moves(position, king_ind);
    for(let i = 0; i < bishop_move_list.length; i++) {
        check_ind = bishop_move_list[i];
        if(is_enemy_piece(position, check_ind, turn) && is_bishop(position, check_ind)) {
            return true;
        }
        if(is_enemy_piece(position, check_ind, turn) && is_queen(position, check_ind)) {
            return true;
        }
    }
    // Rook moves (or Queen)
    let rook_move_list = rook_moves(position, king_ind);
    for(let i = 0; i < rook_move_list.length; i++) {
        check_ind = rook_move_list[i];
        if(is_enemy_piece(position, check_ind, turn) && is_rook(position, check_ind)) {
            return true;
        }
        if(is_enemy_piece(position, check_ind, turn) && is_queen(position, check_ind)) {
            return true;
        }
    }
    // King moves (for prevention of self-check)
    let king_move_list = king_moves(position, king_ind);
    for(let i = 0; i < king_move_list.length; i++) {
        check_ind = king_move_list[i];
        if(is_enemy_piece(position, check_ind, turn) && is_king(position, check_ind)) {
            return true;
        }
    }

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

function is_pawn_promote(position, ind, turn) {
    if(! is_my_piece(position, ind, turn) || ! is_pawn(position, ind)) {
        return false;
    } else if(turn == COLOR.WHITE) {
        return (ind >=0 && ind <= 8);
    } else {
        return (ind >=56 && ind <= 64);
    }
}

function is_en_passant(position, orig, dest, turn) {
    if(is_my_piece(position, orig, turn) && is_pawn(position, orig)) {
        if(en_passantable == dest) {
            return true;
        }
    }

    return false;
}

function can_castle_kingside(position, turn) {
    if(turn == COLOR.WHITE && (white_king_moved || white_h_rook_moved)) {
        return false;
    }
    if(turn == COLOR.BLACK && (black_king_moved || black_h_rook_moved)) {
        return false;
    }


    // Spaces between rook and king empty
    if(turn == COLOR.WHITE && ! (is_empty(position, 61) && is_empty(position, 62))) {
        return false;
    }
    if(turn == COLOR.BLACK && ! (is_empty(position, 5) && is_empty(position, 6))) {
        return false;
    }

    king_ind = (turn == COLOR.WHITE) ? 60 : 4;
    // Spaces king will travel unchecked 
    if(is_check(position, turn)) {
        return false;
    }
    for(let mvmt = 1; mvmt <= 2; mvmt++) {
        dest = translate(king_ind, mvmt, 0);
        proto_position = position.concat();
        proto_position[dest] = proto_position[king_ind];
        proto_position[king_ind] = CHESS_PIECE.NOTHING;
        if(is_check(proto_position, turn)) {
            return false;
        }
    }

    return true;
}

function can_castle_queenside(position, turn) {
    if(turn == COLOR.WHITE && (white_king_moved || white_a_rook_moved)) {
        return false;
    }
    if(turn == COLOR.BLACK && (black_king_moved || black_a_rook_moved)) {
        return false;
    }


    // Spaces between rook and king empty
    if(turn == COLOR.WHITE && ! (is_empty(position, 59) && is_empty(position, 58))) {
        return false;
    }
    if(turn == COLOR.BLACK && ! (is_empty(position, 3) && is_empty(position, 2))) {
        return false;
    }

    king_ind = (turn == COLOR.WHITE) ? 60 : 4;
    // Spaces king will travel unchecked 
    if(is_check(position, turn)) {
        return false;
    }
    for(let mvmt = -1; mvmt >= -3; mvmt--) {
        dest = translate(king_ind, mvmt, 0);
        proto_position = position.concat();
        proto_position[dest] = proto_position[king_ind];
        proto_position[king_ind] = CHESS_PIECE.NOTHING;
        if(is_check(proto_position, turn)) {
            return false;
        }
    }

    return true;
}

function is_castle_move(position, orig, dest, turn) {
    if(can_castle_kingside(position, turn) && (
           (turn == COLOR.WHITE && orig == 60 && dest == 62)
        || (turn == COLOR.BLACK && orig ==  4 && dest ==  6))) {
        return true;
    }
    if(can_castle_queenside(position, turn) && (
           (turn == COLOR.WHITE && orig == 60 && dest == 58)
        || (turn == COLOR.BLACK && orig ==  4 && dest ==  2))) {
        return true;
    }

    return false;
}

function is_my_piece(position, ind, turn) {
    if(ind < 0 || ind > 63) {
        return false;
    }
    if(turn === COLOR.WHITE) {
        return (
               position[ind] == CHESS_PIECE.WHITE_PAWN
            || position[ind] == CHESS_PIECE.WHITE_KNIGHT
            || position[ind] == CHESS_PIECE.WHITE_BISHOP
            || position[ind] == CHESS_PIECE.WHITE_ROOK
            || position[ind] == CHESS_PIECE.WHITE_QUEEN
            || position[ind] == CHESS_PIECE.WHITE_KING
        );
    } else {
        return (
               position[ind] == CHESS_PIECE.BLACK_PAWN
            || position[ind] == CHESS_PIECE.BLACK_KNIGHT
            || position[ind] == CHESS_PIECE.BLACK_BISHOP
            || position[ind] == CHESS_PIECE.BLACK_ROOK
            || position[ind] == CHESS_PIECE.BLACK_QUEEN
            || position[ind] == CHESS_PIECE.BLACK_KING
        );
    }
}

function is_enemy_piece(position, ind, turn) {
    if(ind < 0 || ind > 63) {
        return false;
    }
    if(turn === COLOR.WHITE) {
        return (
               position[ind] == CHESS_PIECE.BLACK_PAWN
            || position[ind] == CHESS_PIECE.BLACK_KNIGHT
            || position[ind] == CHESS_PIECE.BLACK_BISHOP
            || position[ind] == CHESS_PIECE.BLACK_ROOK
            || position[ind] == CHESS_PIECE.BLACK_QUEEN
            || position[ind] == CHESS_PIECE.BLACK_KING
        );
    } else {
        return (
               position[ind] == CHESS_PIECE.WHITE_PAWN
            || position[ind] == CHESS_PIECE.WHITE_KNIGHT
            || position[ind] == CHESS_PIECE.WHITE_BISHOP
            || position[ind] == CHESS_PIECE.WHITE_ROOK
            || position[ind] == CHESS_PIECE.WHITE_QUEEN
            || position[ind] == CHESS_PIECE.WHITE_KING
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
