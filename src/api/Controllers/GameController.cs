using Microsoft.AspNetCore.Mvc;

using JsChessServerApi.Data;
using JsChessServerApi.Services;

namespace JsChessServerApi.Controllers;

[ApiController]
[Route("/[controller]")]
public class GameController : Controller {

    private IGameService GameService;

    public GameController(IGameService gameService) {
        GameService = gameService;
    }

    [HttpGet("CreateGame")]
    public IActionResult CreateGame() {
        Game newGame = GameService.InitializeGame();
        return Json(newGame);
    }
}
