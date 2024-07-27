using JsChessServerApi.Data;

namespace JsChessServerApi.Services;

public class GameService : IGameService {
    public Game InitializeGame() {
        return new Game();
    }
}
