using JsChessServerApi.Services;

namespace JsChessServerApi;

public class Program {
    public static void Main(string[] args) {
        var builder = WebApplication.CreateBuilder(args);
        var services = builder.Services;

        services.AddControllers();
        services.AddSingleton<IHelloWorldService, HelloWorldService>();

        var app = builder.Build();

        app.MapControllers();

        app.Run();
    }
}

