namespace JsChessServerApi.Data;

public class Pawn : Piece {

    public override PieceType Type { get { return PieceType.Pawn; } }

    public override Player Color { get; }

    public Pawn(Player color) {
        Color = color;
    }

    public override Pawn Copy() {
        Pawn copy = new Pawn(Color);
        copy.HasMoved = HasMoved;
        return copy;
    }
}
