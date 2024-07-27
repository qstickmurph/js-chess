using JsChessServerApi.Data;

namespace JsChessServerApi.Services;

public class BoardService : IBoardService {

    public Board InitializeBoard() {
        Board board = new Board();
        AddStartPieces(board);
        return board;
    }

    private void AddStartPieces(Board board) {
        board[0, 0] = new Rook(Player.White);
        board[0, 1] = new Knight(Player.White);
        board[0, 2] = new Bishop(Player.White);
        board[0, 3] = new Queen(Player.White);
        board[0, 4] = new King(Player.White);
        board[0, 5] = new Bishop(Player.White);
        board[0, 6] = new Knight(Player.White);
        board[0, 7] = new Rook(Player.White);

        board[7, 0] = new Rook(Player.Black);
        board[7, 1] = new Knight(Player.Black);
        board[7, 2] = new Bishop(Player.Black);
        board[7, 3] = new Queen(Player.Black);
        board[7, 4] = new King(Player.Black);
        board[7, 5] = new Bishop(Player.Black);
        board[7, 6] = new Knight(Player.Black);
        board[7, 7] = new Rook(Player.Black);

        for (int i = 0; i < 8 ; i++) {
            board[0, i] = new Pawn(Player.White);
            board[7, i] = new Pawn(Player.Black);
        }
    }

    public bool IsEmpty(Board board, Position pos) {
        return board[pos] == null;
    }

}

