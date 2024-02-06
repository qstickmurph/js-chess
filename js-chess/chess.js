chess_squares = document.getElementsByClassName("chess-square");
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


function load_page(){
    let starting_positions = 
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
    show_position(starting_positions);
    chess_game_loop();
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

        switch(curr_piece){
            case CHESS_PIECE.WHITE_KING: icon_file = "icons/kl.svg"; break;
            case CHESS_PIECE.WHITE_QUEEN: icon_file = "icons/ql.svg"; break;
            case CHESS_PIECE.WHITE_ROOK: icon_file = "icons/rl.svg"; break;
            case CHESS_PIECE.WHITE_BISHOP: icon_file = "icons/bl.svg"; break;
            case CHESS_PIECE.WHITE_KNIGHT: icon_file = "icons/nl.svg"; break;
            case CHESS_PIECE.WHITE_PAWN: icon_file = "icons/pl.svg"; break;
            case CHESS_PIECE.BLACK_KING: icon_file = "icons/kd.svg"; break;
            case CHESS_PIECE.BLACK_QUEEN: icon_file = "icons/qd.svg"; break;
            case CHESS_PIECE.BLACK_ROOK: icon_file = "icons/rd.svg"; break;
            case CHESS_PIECE.BLACK_BISHOP: icon_file = "icons/bd.svg"; break;
            case CHESS_PIECE.BLACK_KNIGHT: icon_file = "icons/nd.svg"; break;
            case CHESS_PIECE.BLACK_PAWN: icon_file = "icons/pd.svg"; break;
        }

        icon = document.createElement("img");
        icon.setAttribute("src", icon_file);
        icon.setAttribute("class", "piece-icon");
        curr_square.appendChild(icon);
    }
}

function show_hints() {

}

function chess_game_loop() {
    let turn = COLOR.WHITE;
    
}

function get_legal_moves() {

}


