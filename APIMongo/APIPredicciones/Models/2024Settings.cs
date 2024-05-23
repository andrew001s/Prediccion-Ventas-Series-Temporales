namespace APIPredicciones.Models
{
    public class _2024Settings: I_2024Settings
    {
        public string MongoDBConnection { get; set; }
        public string DatabaseName { get; set; }
        public string CollectionName { get; set; }
        public string CollectionName2 { get; set; }
    }
    

    
    public interface I_2024Settings
    {
        string MongoDBConnection { get; set; }
        string DatabaseName { get; set; }
        string CollectionName { get; set; }
        string CollectionName2 { get; set; }

    }
}
