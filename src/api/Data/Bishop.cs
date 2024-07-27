namespace JsChessServerApi.Data;

public class Bishop : Piece {

    public override PieceType Type { get; } = PieceType.Bishop;

    public override Player Color { get; set; }
}
