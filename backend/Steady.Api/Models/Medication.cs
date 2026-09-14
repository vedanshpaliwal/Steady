using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Steady.Api.Models;

public sealed class Medication
{
    [BsonId, BsonRepresentation(BsonType.ObjectId)] public string? Id { get; set; }
    public string Name { get; set; } = "";
    public string Dosage { get; set; } = "";
    public string Time { get; set; } = "08:00";
    public string Frequency { get; set; } = "Daily";
    public bool Active { get; set; } = true;
}

public sealed class DoseLog
{
    [BsonId, BsonRepresentation(BsonType.ObjectId)] public string? Id { get; set; }
    public string MedicationId { get; set; } = "";
    public string MedicationName { get; set; } = "";
    public DateTime TakenAt { get; set; } = DateTime.UtcNow;
    public string Status { get; set; } = "taken";
}
