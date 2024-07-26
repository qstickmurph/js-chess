using Microsoft.AspNetCore.Mvc;
using JsChessServerApi.Services;

namespace JsChessServerApi.Controllers;

[ApiController]
[Route("")]
[Route("[controller]")]
public class HelloWorldController : Controller {

    IHelloWorldService helloWorldService;
    
    public HelloWorldController(IHelloWorldService helloWorldService) {
        this.helloWorldService = helloWorldService;
    }

    [HttpGet("")]
    public IActionResult Index() {
        return Content("This is my <b>default</b> action...");
    }

    [HttpGet("UseService")]
    [HttpGet("UseService/{id}")]
    public IActionResult UseService(int id = 0) {
        int idPlusOne = this.helloWorldService.NPlusOne(id);
        return Content(idPlusOne.ToString());
    }
}
