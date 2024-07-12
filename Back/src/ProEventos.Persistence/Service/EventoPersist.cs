using Domain.Models;
using Microsoft.EntityFrameworkCore;
using Persistence.Interfaces;
using Persistence.Models;
using ProEventos.Data;
using System.Linq;
using System.Threading.Tasks;

namespace Persistence.Service
{
    public class EventoPersist : IEventoPersist
    {
        private readonly ProEventosContext _context;

        public EventoPersist(ProEventosContext context)
        {
            _context = context;
            _context.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
        }
        public async Task<PageList<Evento>> GetAllEventosAsync(PageParams pageParams, bool includePalestrantes = false)
        {
            IQueryable<Evento> query = _context.Eventos
                            .Include(e => e.Lotes)
                            .Include(e => e.RedeSociais);
            if (includePalestrantes)
            {
                query = query
                    .Include(e => e.PalestrantesEventos)
                    .ThenInclude(pe => pe.Palestrante);
            }
            query = query.AsNoTracking()
                .Where(e => e.Tema.ToLower().Contains(pageParams.Term.ToLower()) || e.Local.ToLower().Contains(pageParams.Term.ToLower()))
                .OrderBy(e => e.Id);

            return await PageList<Evento>.CreateAsync(query, pageParams.PageNumber, pageParams.pageSize);
        }

        public async Task<Evento> GetEventosByIdAsync(int eventoId, bool includePalestrantes = false)
        {
            IQueryable<Evento> query = _context.Eventos
               .Include(e => e.Lotes)
               .Include(e => e.RedeSociais);
            if (includePalestrantes)
            {
                query = query
                    .Include(e => e.PalestrantesEventos)
                    .ThenInclude(pe => pe.Palestrante);
            }
            query = query.OrderBy(e => e.Id)
                          .Where(e => e.Id == eventoId);
            return await query.FirstOrDefaultAsync();
        }
    }
}
