using DataAccess.DbAccess;
using DataAccess.Services;
using ImageGallery;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Serilog;
using System.Configuration;
using System.Net.NetworkInformation;
using WatchDog;
using WatchDog.src.Enums;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSingleton<ISqlDataAccess, SqlDataAccess>();
builder.Services.AddScoped(typeof(IServicesData<>), typeof(ServicesData<>));


var connStr = builder.Configuration.GetConnectionString("Default");

//builder.Services.AddWatchDogServices(); // Register services for logging service
builder.Services.AddWatchDogServices(settings =>
{
    settings.IsAutoClear = true;
    settings.ClearTimeSchedule = WatchDogAutoClearScheduleEnum.Daily;
    settings.DbDriverOption = WatchDogDbDriverEnum.MSSQL; // = WatchDogSqlDriverEnum.MSSQL;
    settings.SetExternalDbConnString = connStr;
});

// Configure Serilog for file logging
builder.Host.UseSerilog((context, configuration) =>
{
    configuration
        .WriteTo.Console() // Optional: Write logs to the console as well
        .WriteTo.File("Logs/myapp.log", rollingInterval: RollingInterval.Day) // Specify the log file path and rolling interval
        .WriteTo.MSSqlServer(connStr, "Logs", autoCreateSqlTable: true); //; Specify the connection string and table name
        //.ReadFrom.Configuration(context.Configuration);
});

builder.Services.AddCors(); // Make sure you call this previous to AddMvc

//you can configure a specific ORIGIN to accept api calls and avoid leaving your API so open to anyone
//services.AddCors(options => options.AddPolicy("ApiCorsPolicy", builder =>
//{
//    builder.WithOrigins("http://localhost:4200").AllowAnyMethod().AllowAnyHeader();
//}));

//builder.Services.AddLogging(builder => builder.AddConsole());
//var loggerFactory = builder.Services.GetService<ILoggerFactory>(); 
//ImageUpload.InitializeDependencies(ILoggerFactory LoggerFactory); // Initialize logger
//builder.Services.AddSingleton(typeof(ILogger<>), typeof(Logger<>));

var app = builder.Build();

//app.UseStaticFiles();

//Using absolute paths provides a more predictable way to reference files
//cant i use webroot or contentRoot path
//https://chat.openai.com/c/8eaa8395-4dd7-4c5f-b5cf-0ecaaca04118
//app.UseStaticFiles(new StaticFileOptions
//{
//    FileProvider = new PhysicalFileProvider(@"C:\YourProject\Images"),
//    RequestPath = "/Images"
//});

    app.UseStaticFiles(new StaticFileOptions
    {
        FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "Uploads")),
        RequestPath = "/Uploads"
    });


// Make sure you call this before calling app.UseMvc()
app.UseCors(options => options
     .AllowAnyOrigin()
     .AllowAnyMethod()
     .AllowAnyHeader());
//app.UseCors(
//    options => options.WithOrigins("http://localhost:4200").AllowAnyMethod()
//); 

// Make sure you call this before calling app.UseMvc()
//app.UseCors("ApiCorsPolicy");


app.UseWatchDogExceptionLogger(); // Add Exception logging

// Add middleware and setup username + password. You should change credentials.
app.UseWatchDog(opt =>
{
    opt.WatchPageUsername = "admin";
    opt.WatchPagePassword = "admin";
    //opt.Blacklist = "api/login, weatherforecast"; // exclude certain endpoints eg login
});

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.UseHttpsRedirection();

app.imageUploadRoutes();

app.Run();


//var summaries = new[]
//{
//    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
//};

//app.MapGet("/weatherforecast", () =>
//{
//    var forecast = Enumerable.Range(1, 5).Select(index =>
//        new WeatherForecast
//        (
//            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
//            Random.Shared.Next(-20, 55),
//            summaries[Random.Shared.Next(summaries.Length)]
//        ))
//        .ToArray();
//    return forecast;
//})
//.WithName("GetWeatherForecast")
//.WithOpenApi();

//app.Run();

//internal record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
//{
//    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
//}
