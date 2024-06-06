using Microsoft.AspNetCore.Mvc;
using ProEventos.API.Models;

namespace ProEventos.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EventoController : ControllerBase
{
   public IEnumerable<Evento> _evento = new Evento[] {
          new Evento() {
            EventoId = 1,
            Tema = "Angular e 11 e .NET 5",
            Local = "Belo Horizonte",
            Lote = "1 Lote",
            QtdPessoas = 250,
            DataEvento = DateTime.Now.AddDays(2).ToString("dd/MM/yyyy"),
            ImagemUrl = "foto.png"
        },
          new Evento() {
            EventoId = 2,
            Tema = "Angular e Suas Novidades",
            Local = "São Paulo",
            Lote = "2 Lote",
            QtdPessoas = 350,
            DataEvento = DateTime.Now.AddDays(2).ToString("dd/MM/yyyy"),
            ImagemUrl = "foto.png"
        }
    };

    public EventoController()
    {

    }

    [HttpGet]
    public IEnumerable<Evento> Get()
    {
        return _evento;
    }

    [HttpGet("{id}")]
    public IEnumerable<Evento> GetById(int id)
    {
        return _evento.Where(evento => evento.EventoId == id);
    }

    [HttpPost]
    public string Post()
    {
        return "Exemplo de post";
    }

    [HttpPut("{id}")]
    public string Put(int id)
    {
        return $"Exemplo de put = {id}";
    }

    [HttpDelete("{id}")]
    public string Delete(int id)
    {
        return $"Exemplo de delete = {id}";
    }
}
