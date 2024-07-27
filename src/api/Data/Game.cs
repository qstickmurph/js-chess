namespace JsChessServerApi.Data;

public class Game {
    public Piece[] Board { get; set; } = new Piece[64];

    public Player CurrentPlayer { get; set; } = Player.White;

    public int MoveNumber { get; set; } = 1;
}
