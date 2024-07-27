using JsChessServerApi.Data;
using System.Text.Json;

namespace JsChessServerApi.Services;

public class BoardService : IBoardService {

    public Board InitializeBoard() {
        Board board = new Board();
        AddStartPieces(board);
        return board;
    }

    private void AddStartPieces(Board board) {
        board[0, 0] = new Rook{ Color = Player.White };
        board[0, 1] = new Knight{ Color = Player.White };
        board[0, 2] = new Bishop{ Color = Player.White };
        board[0, 3] = new Queen{ Color = Player.White };
        board[0, 4] = new King{ Color = Player.White };
        board[0, 5] = new Bishop{ Color = Player.White };
        board[0, 6] = new Knight{ Color = Player.White };
        board[0, 7] = new Rook{ Color = Player.White };

        board[7, 0] = new Rook{ Color = Player.Black };
        board[7, 1] = new Knight{ Color = Player.Black };
        board[7, 2] = new Bishop{ Color = Player.Black };
        board[7, 3] = new Queen{ Color = Player.Black };
        board[7, 4] = new King{ Color = Player.Black };
        board[7, 5] = new Bishop{ Color = Player.Black };
        board[7, 6] = new Knight{ Color = Player.Black };
        board[7, 7] = new Rook{ Color = Player.Black };

        for ( int i = 0; i < 8 ; i++ ) {
            board[0, i] = new Pawn{ Color = Player.White };
            board[7, i] = new Pawn{ Color = Player.Black };
        }
    }

    public bool IsEmpty(Board board, Position pos) {
        return board[pos] == null;
    }

}

