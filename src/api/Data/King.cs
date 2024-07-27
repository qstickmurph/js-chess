namespace JsChessServerApi.Data;

public class King : Piece {

    public override PieceType Type { get; } = PieceType.King;

    public override Player Color { get; set; }
}
