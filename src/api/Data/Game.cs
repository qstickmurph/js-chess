namespace JsChessServerApi.Data;

public class Game {
    public Board Board { get; set; } = new Board();

    public Player CurrentPlayer { get; set; } = Player.White;

    public int MoveNumber { get; set; } = 1;
}
