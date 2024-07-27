namespace JsChessServerApi.Data;

public abstract class Piece {

    public abstract PieceType Type { get; }

    public abstract Player Color { get; set; }

    public bool HasMoved { get; set; } = false;
}

