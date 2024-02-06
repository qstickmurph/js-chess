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

// Global Variables
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

// Functions

function load_page() {
    create_board();
    chess_board.setAttribute("width", "1000px");
    set_element_vars();
    show_position(position);
    turn = COLOR.WHITE;
    add_square_listeners();
}

function create_board() {
    let color = "light";
    for( let i = 1; i <= 8; i++) {
        rank = document.createElement("div");
        rank.setAttribute("class", "chess-rank " + i);
        for( let j = 1; j <= 8; j++) {
            square = document.createElement("div");
            square.setAttribute("class", "chess-square " + color + " " + i + j);
            rank.appendChild(square);

            color = (color === "light") ? "dark" : "light";
        }
        let chess_board = document.getElementsByClassName("chess-board")[0];
        chess_board.appendChild(rank);
        color = (color === "light") ? "dark" : "light";
    }

    var chess_board = document.getElementsByClassName("chess-board")[0];
}

function add_square_listeners() {
    for(let i = 0; i < chess_squares.length; i++){
        chess_squares[i].addEventListener("click", on_click_square);
    }
}

function show_position(position) {
    for(let i = 0; i < chess_squares.length; i++) {
        curr_piece= position[i]
        curr_square = chess_squares[i]

        while(curr_square.firstChild) {
            curr_square.removeChild(curr_square.lastChild);
        }

        if(curr_piece == CHESS_PIECE.NOTHING){
            continue;
        }

        icon = document.createElement("img");
        icon.setAttribute("src", get_icon_file(curr_piece));
        icon.setAttribute("class", "piece-icon");
        curr_square.appendChild(icon);
    }
}

function get_icon_file(piece){
    switch(curr_piece){
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

function on_click_square(e){
    e.currentTarget.classList.add("highlighted");
}

function move_piece(orig, dest){

}

function show_hints() {

}


function get_legal_moves() {

}

