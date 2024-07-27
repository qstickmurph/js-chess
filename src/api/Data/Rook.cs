namespace JsChessServerApi.Data;

public class Rook : Piece {

    public override PieceType Type { get { return PieceType.Rook; } }

    public override Player Color { get; }

    public Rook(Player color) {
        Color = color;
    }

    public override Rook Copy() {
        Rook copy = new Rook(Color);
        copy.HasMoved = HasMoved;
        return copy;
    }
}
