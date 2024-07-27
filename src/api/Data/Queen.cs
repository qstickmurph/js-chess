namespace JsChessServerApi.Data;

public class Queen : Piece {

    public override PieceType Type { get; } = PieceType.Queen;

    public override Player Color { get; set; }
}
