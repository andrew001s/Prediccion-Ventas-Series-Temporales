using APIPredicciones.Models;
using APIPredicciones.Services;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.


// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.Configure<_2024Settings>(builder.Configuration.GetSection("ConnectionStrings"));
builder.Services.AddSingleton(sp => sp.GetRequiredService<IOptions<_2024Settings>>().Value);
builder.Services.AddSingleton<DBMongo>();
builder.Services.AddControllers();
builder.Services.AddCors(options => {
    options.AddPolicy("AllowOrigin",
        builder => builder.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
});
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseCors("AllowOrigin");
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
