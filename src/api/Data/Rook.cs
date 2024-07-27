namespace JsChessServerApi.Data;

public class Rook : Piece {

    public override PieceType Type { get; } = PieceType.Rook;

    public override Player Color { get; set; }
}

