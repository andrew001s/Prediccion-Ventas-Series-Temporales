using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace APIPredicciones.Models
{
    public class Flower
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string fecha { get; set; }
        public string variedad { get; set; }
        public double produccion { get; set; }
        public double ventas { get; set; }
    }
}
