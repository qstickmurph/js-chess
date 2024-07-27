namespace JsChessServerApi.Data;

public class Queen : Piece {

    public override PieceType Type { get { return PieceType.Queen; } }

    public override Player Color { get; }

    public Queen(Player color) {
        Color = color;
    }

    public override Queen Copy() {
        Queen copy = new Queen(Color);
        copy.HasMoved = HasMoved;
        return copy;
    }
}
