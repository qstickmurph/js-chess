// Constant Enums
const CHESS_PIECE = Object.freeze({
    NOTHING: 0,
    WHITE_KING: 1,
    WHITE_QUEEN: 2,
    WHITE_ROOK: 3,
    WHITE_BISHOP: 4,
    WHITE_KNIGHT: 5,
    WHITE_PAWN: 6,
    BLACK_KING: 7,
    BLACK_QUEEN: 8,
    BLACK_ROOK: 9,
    BLACK_BISHOP: 10,
    BLACK_KNIGHT: 11,
    BLACK_PAWN: 12
});

const COLOR = Object.freeze({
    WHITE: 0,
    BLACK: 1
})

// Global Variables - Data
let position = 
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
let letters = "abcdefgh".split("");
let nums = "12345678".split("");
let turn = COLOR.WHITE;
let flipped_board = false;
let selected_ind = -1;

// Global Variables - DOM
let chess_board
let chess_squares = [];

// Functions

function init() {
    get_chess_board();
    turn = COLOR.WHITE;
    add_square_listeners();
    render();
}

function start_chess_game(){

}

function stop_chess_game(){

}

function get_chess_board() {
    chess_board = document.getElementsByClassName("chess-board")[0];
    chess_squares = [];
    for(let i = 0; i < 8; i++) {
        let rank_element = chess_board.children[i];
        chess_squares = chess_squares.concat(Array.from(rank_element.children));
    }
}

function add_square_listeners() {
    for(let i = 0; i < chess_squares.length; i++) {
        chess_squares[i].addEventListener("click", on_click_square);
        chess_squares[i].addEventListener("contextmenu", on_click_square);
    }
}


// Rendering Functions
function render() {
    show_position();
    show_selected_ind();
    show_hints();
}

function show_position() {
    for(let i = 0; i < chess_squares.length; i++) {
        curr_piece= position[i]
        curr_square = chess_squares[i]

        while(curr_square.firstChild) {
            curr_square.removeChild(curr_square.lastChild);
        }

        if(curr_piece == CHESS_PIECE.NOTHING) {
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

// Event Listener Functions
function on_click_square(e) {
    if(e.button == 2) { //right click to hl a square
        if(e.currentTarget.classList.contains("hl")) {
            e.currentTarget.classList.remove("hl");
        } else {
            e.currentTarget.classList.add("hl");
        }
    }else { //left click to select a piece
        let ind = chess_squares.indexOf(e.currentTarget);

        if(is_my_piece(ind)) { // if piece is same color as current turn, select it
            selected_ind = ind;
        } else {// otherwise, attempt to move the selected piece
            move_piece(selected_ind, ind);
        }

    }

    render();
}

// Helper Functions
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



function move_piece(orig, dest) {
    if(orig == -1) {
        return -1;
    }

    if(is_legal_move(orig, dest)) {
        position[dest] = position[orig];
        position[orig] = CHESS_PIECE.NOTHING;
        swap_turn();
    }

    selected_ind = -1;
}

function swap_turn() {
    turn = (turn === COLOR.WHITE) ? COLOR.BLACK : COLOR.WHITE;
}

function get_legal_moves(ind) {
    let legal_moves = [];
    // Nothing
    if(position[ind] == CHESS_PIECE.NOTHING) {
        legal_moves = [];
    }
    // White Pawn
    else if(position[ind] == CHESS_PIECE.WHITE_PAWN) {
        // Forward moves
        if(47 < ind && ind < 56) { // if on original space
            if(! is_enemy_piece(translate(ind, 0, -1))){
                legal_moves.push(translate(ind, 0, -1));
            }
            if(! is_enemy_piece(translate(ind, 0, -2))){
                legal_moves.push(translate(ind, 0, -2));
            }
        } else { // if not on original space
            if(! is_enemy_piece(translate(ind, 0, -1))){
                legal_moves.push(translate(ind, 0, -1));
            }
        }
        
        // Diagonal Moves
        if(is_enemy_piece(translate(ind, 1, -1))) {
            legal_moves.push(translate(ind, 1, -1));
        }
        if(is_enemy_piece(translate(ind, -1, -1))) {
            legal_moves.push(translate(ind, -1, -1));
        }
    }
    
    else if(position[ind] == CHESS_PIECE.BLACK_PAWN) { // Black Pawn
        // Forward moves
        if(7 < ind && ind < 16) { // if on original space
            if(! is_enemy_piece(translate(ind, 0, 1))){
                legal_moves.push(translate(ind, 0, 1));
            }
            if(! is_enemy_piece(translate(ind, 0, 2))){
                legal_moves.push(translate(ind, 0, 2));
            }
        } else { // if not on original space
            if(! is_enemy_piece(translate(ind, 0, 1))){
                legal_moves.push(translate(ind, 0, 1));
            }
        }
        
        // Diagonal Moves
        if(is_enemy_piece(translate(ind, 1, 1))) {
            legal_moves.push(translate(ind, 1, 1));
        }
        if(is_enemy_piece(translate(ind, -1, 1))) {
            legal_moves.push(translate(ind, -1, 1));
        }
    }
    // Knight
    else if(position[ind] == CHESS_PIECE.WHITE_KNIGHT || position[ind] == CHESS_PIECE.BLACK_KNIGHT) {
        if(translate(ind, 1, 2) != -1){
            legal_moves.push(translate(ind, 1, 2));
        }
        if(translate(ind, -1, 2) != -1){
            legal_moves.push(translate(ind, -1, 2));
        }
        if(translate(ind, 1, -2) != -1){
            legal_moves.push(translate(ind, 1, -2));
        }
        if(translate(ind, -1, -2) != -1){
            legal_moves.push(translate(ind, -1, -2));
        }
        if(translate(ind, 2, 1) != -1){
            legal_moves.push(translate(ind, 2, 1));
        }
        if(translate(ind, -2, 1) != -1){
            legal_moves.push(translate(ind, -2, 1));
        }
        if(translate(ind, 2, -1) != -1){
            legal_moves.push(translate(ind, 2, -1));
        }
        if(translate(ind, -2, -1) != -1){
            legal_moves.push(translate(ind, -2, -1));
        }
    }
    // Bishop
    else if(position[ind] == CHESS_PIECE.WHITE_BISHOP || position[ind] == CHESS_PIECE.BLACK_BISHOP) {
        for(let xdiff = -1; xdiff <= 1; xdiff += 2){
            for(let ydiff = -1; ydiff <= 1; ydiff += 2){
                dest = translate(ind, xdiff, ydiff)
                while(dest != -1){
                    if(is_my_piece(dest)){
                        break;
                    }
                    legal_moves.push(dest);
                    if(is_enemy_piece(dest)){
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
                if(is_my_piece(dest)){
                    break;
                }
                legal_moves.push(dest);
                if(is_enemy_piece(dest)){
                    break;
                }
                dest = translate(dest, xdiff, 0);
            }
        }
        for(let ydiff = -1; ydiff <= 1; ydiff += 1){
            dest = translate(ind, 0, ydiff)
            while(dest != -1){
                if(is_my_piece(dest)){
                    break;
                }
                legal_moves.push(dest);
                if(is_enemy_piece(dest)){
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
                    if(is_my_piece(dest)){
                        break;
                    }
                    legal_moves.push(dest);
                    if(is_enemy_piece(dest)){
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
                if(dest != -1 && ! is_my_piece(dest)){
                    legal_moves.push(dest);
                }
            }
        }
    }

    // TODO: If in Check, remove all options that don't remove check

    return legal_moves;
}

function translate(orig, x, y) {
    dest = orig + x + 8*y;
    if(0 <= dest && dest <= 63) {
        return dest;
    }
    return -1;
}

function pos_to_ind(x, y) {
    dest = x + 8*y;
    if(0 <= dest && dest <= 63) {
        return dest;
    }
    return -1;
}

function is_in_check(){
    return is_in_check(position);
}

function is_in_check(position){
    return false;
}

function is_legal_move(orig, dest) {
    return get_legal_moves(orig).includes(dest);
}

function is_my_piece(ind) {
    if(ind < 0 || ind > 63) {
        return false;
    }
    if(turn == COLOR.WHITE) {
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

function is_enemy_piece(ind) {
    if(ind < 0 || ind > 63) {
        return false;
    }
    if(turn == COLOR.WHITE) {
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
