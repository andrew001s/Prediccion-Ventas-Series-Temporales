using APIPredicciones.Models;
using APIPredicciones.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace APIPredicciones.Controllers
{
    public class _2024Controller : Controller
    {
       public DBMongo _db;
        public _2024Controller(_2024Settings settings)
        {
            _db = new DBMongo(settings);
        }
        [Route("api/2024")]
        [HttpGet]
        public IActionResult Get()
        {
            return Ok((int)(_db.GetTotal()));
        }
        [HttpGet("{variedad}")]
        public IActionResult GetVariedad(string variedad)
        {
            return Ok(_db.GetVariedad(variedad));
        }
        [Route("api/2024/all")]
        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(_db.Get());
        }
        [Route("api/2024/top10")]
        [HttpGet]
        public IActionResult Gettop()
        {
            return Ok(_db.GetTop10());
        }
        [Route("api/pred")]
        [HttpPost]
        public IActionResult Post([FromBody]_2024 data)
        {
            _db.InsertData(data);
            return Ok();
        }
        [Route("api/2024/delete")]
        [HttpDelete]
        public IActionResult Delete()
        {
            _db.deleteall();
            return Ok();
        }
        [Route("api/2024/{variedad}")]
        [HttpGet]
        public IActionResult GetNombreVariedad(string variedad)
        {
            return Ok(_db.GetNombreVariedad(variedad));
        }
    }
}
