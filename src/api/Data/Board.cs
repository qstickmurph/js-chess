namespace JsChessServerApi.Data;

public class Board {

    private readonly Piece[,] pieces = new Piece[8, 8];

    public Piece this[int row, int col] {
        get { return pieces[row, col]; }
        set { pieces[row, col] = value; }
    }

    public Piece this[Position pos] {
        get { return this[pos.Row, pos.Column]; }
        set { this[pos.Row, pos.Column] = value; }
    }

}
