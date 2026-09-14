using MongoDB.Driver;
using Steady.Api.Models;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddSingleton<IMongoClient>(_ => new MongoClient(builder.Configuration["MongoDb:ConnectionString"] ?? "mongodb://localhost:27017"));
builder.Services.AddSingleton(sp => sp.GetRequiredService<IMongoClient>().GetDatabase(builder.Configuration["MongoDb:Database"] ?? "steady"));
builder.Services.AddCors(o => o.AddDefaultPolicy(p => p.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()));
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();
app.UseCors();
app.UseSwagger();
app.UseSwaggerUI();

var medications = app.Services.GetRequiredService<IMongoDatabase>().GetCollection<Medication>("medications");
var doses = app.Services.GetRequiredService<IMongoDatabase>().GetCollection<DoseLog>("doseLogs");

app.MapGet("/api/health", () => Results.Ok(new { status = "ok", service = "steady-api", database = "mongodb" }));
app.MapGet("/api/medications", async () => Results.Ok(await medications.Find(_ => true).SortBy(x => x.Time).ToListAsync()));
app.MapPost("/api/medications", async (Medication medication) => { medication.Id = null; await medications.InsertOneAsync(medication); return Results.Created($"/api/medications/{medication.Id}", medication); });
app.MapPut("/api/medications/{id}", async (string id, Medication medication) => { medication.Id = id; var r = await medications.ReplaceOneAsync(x => x.Id == id, medication); return r.MatchedCount == 0 ? Results.NotFound() : Results.Ok(medication); });
app.MapDelete("/api/medications/{id}", async (string id) => { var r = await medications.DeleteOneAsync(x => x.Id == id); return r.DeletedCount == 0 ? Results.NotFound() : Results.NoContent(); });
app.MapPost("/api/doses", async (DoseLog log) => { log.Id = null; log.TakenAt = DateTime.UtcNow; await doses.InsertOneAsync(log); return Results.Ok(log); });
app.MapGet("/api/doses/today", async () => { var start = DateTime.UtcNow.Date; var end = start.AddDays(1); return Results.Ok(await doses.Find(x => x.TakenAt >= start && x.TakenAt < end).ToListAsync()); });

app.Run();
