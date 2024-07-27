namespace JsChessServerApi.Data;

public class Knight : Piece {

    public override PieceType Type { get; } = PieceType.Knight;

    public override Player Color { get; set; }
}
