using JsChessServerApi.Data;

namespace JsChessServerApi.Services;

public class GameService : IGameService {

    private IBoardService BoardService;

    public GameService(IBoardService boardService) {
        BoardService = boardService;
    }

    public Game InitializeGame(Board board) {
        Game game = new Game { Board = board };
        return game;
    }

    public Game InitializeGame() {
        Board board = BoardService.InitializeBoard();
        return InitializeGame(board);
    }
}
