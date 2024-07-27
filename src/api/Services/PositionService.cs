using JsChessServerApi.Data;

namespace JsChessServerApi.Services;

public class PositionService : IPositionService {
    public bool IsInsideBoard(Position pos) {
        bool xIsInBounds = pos.Row >= 0 && pos.Row <= 8;
        bool yIsInBounds = pos.Column >= 0 && pos.Column <= 8;

        return xIsInBounds && yIsInBounds;
    }
}
