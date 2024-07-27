using JsChessServerApi.Data;

namespace JsChessServerApi.Services;

public interface IBoardService {

    public Board InitializeBoard();
    public bool IsEmpty(Board board, Position pos);
}
