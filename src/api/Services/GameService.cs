using JsChessServerApi.Data;

namespace JsChessServerApi.Services;

public class GameService : IGameService {

    public Game InitializeGame(Piece [] board) {
        Game game = new Game { Board = board };
        return game;
    }

    public Game InitializeGame() {
        Game game = new Game();
        AddStartPieces(game);
        return game;
    }

    private void AddStartPieces(Game game) {
        AddPiece(game, new Rook{ Color = Player.White }, 0, 0);
        AddPiece(game, new Knight{ Color = Player.White }, 0, 1);
        AddPiece(game, new Bishop{ Color = Player.White }, 0, 2);
        AddPiece(game, new Queen{ Color = Player.White }, 0, 3);
        AddPiece(game, new King{ Color = Player.White }, 0, 4);
        AddPiece(game, new Bishop{ Color = Player.White }, 0, 5);
        AddPiece(game, new Knight{ Color = Player.White }, 0, 6);
        AddPiece(game, new Rook{ Color = Player.White }, 0, 7);

        AddPiece(game, new Rook{ Color = Player.Black }, 7, 0);
        AddPiece(game, new Knight{ Color = Player.Black }, 7, 1);
        AddPiece(game, new Bishop{ Color = Player.Black }, 7, 2);
        AddPiece(game, new Queen{ Color = Player.Black }, 7, 3);
        AddPiece(game, new King{ Color = Player.Black }, 7, 4);
        AddPiece(game, new Bishop{ Color = Player.Black }, 7, 5);
        AddPiece(game, new Knight{ Color = Player.Black }, 7, 6);
        AddPiece(game, new Rook{ Color = Player.Black }, 7, 7);

        for ( int i = 0; i < 8 ; i++ ) {
            AddPiece(game, new Pawn{ Color = Player.White }, 0, i);
            AddPiece(game, new Pawn{ Color = Player.Black }, 7, i);
        }
    }
    

    private void AddPiece(Game game, Piece piece, int rank, int file) {
        var board = game.Board;

        board[file + rank*8] = piece;
    }
}
