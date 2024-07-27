namespace JsChessServerApi.Data;

public class King : Piece {

    public override PieceType Type { get { return PieceType.King; } }

    public override Player Color { get; }

    public King(Player color) {
        Color = color;
    }

    public override King Copy() {
        King copy = new King(Color);
        copy.HasMoved = HasMoved;
        return copy;
    }
}
