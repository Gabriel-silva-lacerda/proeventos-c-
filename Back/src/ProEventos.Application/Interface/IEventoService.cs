using Persistence.Models;
using ProEventos.Dtos;
using System.Threading.Tasks;

namespace Application.Interface
{
    public interface IEventoService
    {
        Task<EventoDto> AddEventos(EventoDto model);
        Task<EventoDto> UpdateEvento(int EventoId, EventoDto model);
        Task<bool> DeleteEvento(int EventoId);
        Task<PageList<EventoDto>> GetAllEventosAsync(PageParams pageParams, bool includePalestrantes);
        Task<EventoDto> GetEventosByIdAsync(int eventoId, bool includePalestrantes );
    }
}
