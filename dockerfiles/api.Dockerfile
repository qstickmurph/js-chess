FROM mcr.microsoft.com/dotnet/sdk:8.0 as build

WORKDIR /app/

COPY ./src/api/ .

RUN dotnet restore
RUN dotnet publish -C Release -o out

FROM mcr.microsoft.com/dotnet/aspnet:8.0@sha256:6c4df091e4e531bb93bdbfe7e7f0998e7ced344f54426b7e874116a3dc3233ff as deploy

WORKDIR /app

COPY --from=build /app/out .

ENTRYPOINT ["dotnet", "DotNet.Docker.dll"]
