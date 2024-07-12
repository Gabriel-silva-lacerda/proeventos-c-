using Domain.Models;
using Persistence.Models;
using System.Threading.Tasks;

namespace Persistence.Interfaces
{
    public interface IEventoPersist
    {
        //EVENTOS
        Task<PageList<Evento>> GetAllEventosAsync(PageParams pageParams, bool includePalestrantes = false);
        Task<Evento> GetEventosByIdAsync(int eventoId, bool includePalestrantes = false);
    }
}
