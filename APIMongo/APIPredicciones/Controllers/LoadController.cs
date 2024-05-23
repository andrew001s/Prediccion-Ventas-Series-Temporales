using APIPredicciones.Models;
using APIPredicciones.Services;
using Microsoft.AspNetCore.Mvc;
using System.Globalization;
using CsvHelper;
using System.ComponentModel;
using CsvHelper.Configuration;
using CsvHelper.TypeConversion;

namespace APIPredicciones.Controllers
{
    public class LoadController : Controller
    {
        public DBMongo _db;
        public LoadController(_2024Settings settings)
        {
            _db = new DBMongo(settings);
        }
        [HttpGet("api/load")]
        public async Task<IActionResult> LoadData()
        {
            var data = await _db.GetFlowerDataAsync();
            return Ok(data);
        }

        [HttpPost("api/upload")]
        public async Task<IActionResult> UploadCsv([FromForm] Microsoft.AspNetCore.Http.IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No se proporcionó ningún archivo o el archivo está vacío.");
            }

            try
            {
                using (var streamReader = new StreamReader(file.OpenReadStream()))
                using (var csvReader = new CsvReader(streamReader, new CsvConfiguration(CultureInfo.InvariantCulture)))
                {
                    var records = csvReader.GetRecords<FlowerDataUpload>().ToList();
                    if (records.Any())
                    {
                        var groupedRecords = records.GroupBy(r => new { r.variedad, Year = Convert.ToDateTime(r.fecha).Year, Month = Convert.ToDateTime(r.fecha).Month })
                            .Select(g => new FlowerDataUpload
                            {
                                fecha = new DateTime(g.Key.Year, g.Key.Month, 1).ToString("yyyy-MM-dd"),
                                variedad = g.Key.variedad,
                                produccion = g.Sum(r => r.produccion),
                                ventas = g.Sum(r => r.ventas)
                            });

                        foreach (var item in groupedRecords)
                        {
                            await _db.InsertFlowerDataAsync(item);
                        }

                        return Ok($"Se han guardado {groupedRecords.Count()} registros en la base de datos.");
                    }
                    else
                    {
                        return BadRequest("No se encontraron registros en el archivo CSV.");
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al procesar el archivo CSV: {ex.Message}");
            }
        }
    }

    
}
