namespace JsChessServerApi.Data;

public class Pawn : Piece {

    public override PieceType Type { get; } = PieceType.Pawn;

    public override Player Color { get; set; }
}
