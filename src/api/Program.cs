using JsChessServerApi.Services;

namespace JsChessServerApi;

public class Program {
    public static void Main(string[] args) {
        var builder = WebApplication.CreateBuilder(args);
        var services = builder.Services;
        var config = builder.Configuration;

        services.AddControllers();

        services.AddSingleton<IHelloWorldService, HelloWorldService>();
        services.AddSingleton<IGameService, GameService>();

        var app = builder.Build();

        app.MapControllers();

        app.Run();
    }
}

