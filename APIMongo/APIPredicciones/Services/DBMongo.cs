using APIPredicciones.Models;
using MongoDB.Bson;
using MongoDB.Driver;

namespace APIPredicciones.Services
{

    public class DBMongo
    {
        private readonly IMongoCollection<FlowerDataUpload> _collection;
        private readonly IMongoCollection<Flower> _flower;
        private IMongoCollection<_2024> _db;

        public DBMongo(_2024Settings settings)
        {
            var client = new MongoClient(settings.MongoDBConnection);
            var database = client.GetDatabase(settings.DatabaseName);
            _db = database.GetCollection<_2024>(settings.CollectionName);
            _db = database.GetCollection<_2024>(settings.CollectionName2);
            _collection = database.GetCollection<FlowerDataUpload>(settings.CollectionName);
            _flower= database.GetCollection<Flower>(settings.CollectionName);
        }
        public double GetTotal()
        {
            double suma= 0;
            _db.AsQueryable().ToList().ForEach(x => suma += x.ventas);

            return suma;

        }

        public void InsertData(_2024 data)
        {
            try
            {
                _db.InsertOne(data);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al insertar datos en MongoDB: {ex.Message}");
                throw; // Puedes manejar el error de otra manera si lo deseas
            }
        }
        public List<double> GetVariedad(string variedad)
        {
            var filter = Builders<_2024>.Filter.Eq("variedad", variedad);
            var list = _db.Find(filter).ToList();
            List<double> ventas = new List<double>();
            foreach (var item in list)
            {
                ventas.Add(item.ventas);
            }
            return ventas;
        }

        public List<string> GetNombreVariedad(string variedad)
        {
            var filter = Builders<_2024>.Filter.Eq("variedad", variedad);
            var list = _db.Find(filter).ToList();
            List<string> ventas = new List<string>();
            foreach (var item in list)
            {
                ventas.Add(item.fecha);
            }
            return ventas;
        }

        public List<Comparacion> Get()
        {
            List<Comparacion> listaNombreValor = new List<Comparacion>();
            string variedadMayorValor = null;
            double mayorValor = double.MinValue;
            var res=_db.Find(_ => true).ToList();
            foreach(var item in res)
            {
                if (item.ventas > mayorValor)
                {
                    mayorValor = item.ventas;
                    variedadMayorValor = item.variedad;

                }
            }
            listaNombreValor.Add(new Comparacion { variedad = variedadMayorValor, valor = (int)mayorValor });

            return listaNombreValor;
        }
        public List<Comparacion> GetTop10()
        {
            var groupedResult = _db.Aggregate()
                .Group(x => x.variedad, g => new { Variedad = g.Key, TotalVentas = g.Sum(x => x.ventas) })
                .SortByDescending(x => x.TotalVentas)
                .Limit(10)
                .ToList();

            List<Comparacion> listaNombreValor = new List<Comparacion>();

            foreach (var item in groupedResult)
            {
                listaNombreValor.Add(new Comparacion { variedad = item.Variedad, valor = (int)item.TotalVentas });
            }
            return listaNombreValor;
        }



        public async Task InsertFlowerDataAsync(FlowerDataUpload data)
        {
            try
            {
                await _collection.InsertOneAsync(data);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al insertar datos en MongoDB: {ex.Message}");
                throw; // Puedes manejar el error de otra manera si lo deseas
            }
        }
        
        public async Task<List<Flower>> GetFlowerDataAsync()
        {
            try
            {
                var result = await _flower.Find(_ => true).ToListAsync();
                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al obtener datos de MongoDB: {ex.Message}");
                throw; // Puedes manejar el error de otra manera si lo deseas
            }
        }
        public void deleteall()
        {
            _db.DeleteMany(_ => true);
        }



    }
}
