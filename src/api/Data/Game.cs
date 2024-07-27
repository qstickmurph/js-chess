namespace JsChessServerApi.Data;

public class Game {
    public Board Board { get; }

    public Player CurrentPlayer { get; }

    public int MoveNumber { get; }

    public Game() {
        Board = Board.Initial();
        CurrentPlayer = Player.White;
        MoveNumber = 1;
    }

    public Game(Player currentPlayer, Board board, int moveNumber = 1) {
        CurrentPlayer = currentPlayer;
        Board = board;
        MoveNumber = moveNumber;
    }
}
