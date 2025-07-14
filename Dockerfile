# Build aşaması
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src

# Proje dosyasını kopyala ve restore et
COPY ModularSaaS.csproj ./
RUN dotnet restore ModularSaaS.csproj

# Tüm dosyaları kopyala ve publish et
COPY . .
RUN dotnet publish ModularSaaS.csproj -c Release -o /app/publish

# Runtime aşaması
FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "ModularSaaS.dll"]