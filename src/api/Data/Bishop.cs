namespace JsChessServerApi.Data;

public class Bishop : Piece {

    public override PieceType Type { get { return PieceType.Bishop; } }

    public override Player Color { get; }

    public Bishop(Player color) {
        Color = color;
    }

    public override Bishop Copy() {
        Bishop copy = new Bishop(Color);
        copy.HasMoved = HasMoved;
        return copy;
    }
}
