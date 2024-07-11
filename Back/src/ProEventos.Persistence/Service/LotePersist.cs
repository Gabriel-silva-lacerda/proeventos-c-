using Domain.Models;
using Microsoft.EntityFrameworkCore;
using Persistence.Interfaces;
using ProEventos.Data;
using System.Linq;
using System.Threading.Tasks;

namespace Persistence.Service
{
    public class LotePersist : ILotePersist
    {
        private readonly ProEventosContext _context;

        public LotePersist(ProEventosContext context)
        {
            _context = context;        }

        public async Task<Lote> GetLoteByIdsAsync(int eventoId, int id)
        {
            IQueryable<Lote> query = _context.Lotes;

            query = query.AsNoTracking().Where(lote => lote.EventoId == eventoId && lote.Id == id);

            return await query.FirstOrDefaultAsync();
        }

        public async Task<Lote[]> GetLotesByEventoIdAsync(int eventoId)
        {
            IQueryable<Lote> query = _context.Lotes;

            query = query.AsNoTracking().Where(lote => lote.EventoId == eventoId);

            return await query.ToArrayAsync();
        }
    }
}
