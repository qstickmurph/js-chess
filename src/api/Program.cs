using JsChessServerApi.Services;

namespace JsChessServerApi;

public class Program {
    public static void Main(string[] args) {
        var builder = WebApplication.CreateBuilder(args);
        var services = builder.Services;
        var config = builder.Configuration;

        services.AddControllers();

        services.AddSingleton<IGameService, GameService>();
        services.AddSingleton<IBoardService, BoardService>();
        services.AddSingleton<IPositionService, PositionService>();
        services.AddSingleton<IPieceService, PieceService>();

        var app = builder.Build();

        app.MapControllers();

        app.Run();
    }
}

