using JsChessServerApi.Data;

namespace JsChessServerApi.Services;

public interface IPositionService {
    public bool IsInsideBoard(Position pos);
}
