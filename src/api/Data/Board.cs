namespace JsChessServerApi.Data;

public class Board {

    public readonly Piece[] pieces = new Piece[64];

    public Piece this[int row, int col] {
        get { return pieces[row + col*8]; }
        set { pieces[row + col*8] = value; }
    }

    public Piece this[Position pos] {
        get { return this[pos.Row, pos.Column]; }
        set { this[pos.Row, pos.Column] = value; }
    }
}
