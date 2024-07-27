using JsChessServerApi.Services;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace JsChessServerApi;

public class Program {
    public static void Main(string[] args) {
        var builder = WebApplication.CreateBuilder(args);
        var services = builder.Services;
        var config = builder.Configuration;

        services.AddControllers().AddJsonOptions( options => 
                options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter(JsonNamingPolicy.CamelCase)));

        services.AddSingleton<IGameService, GameService>();
        services.AddSingleton<IPositionService, PositionService>();
        services.AddSingleton<IPieceService, PieceService>();

        var app = builder.Build();

        app.MapControllers();

        app.Run();
    }
}

