using Domain.Models;
using System.Threading.Tasks;

namespace Persistence.Interfaces
{
    public interface IPalestrantePersist
    {
  
        Task<Palestrante[]> GetAllPalestrantesByNomeAsync(string nome, bool includeEventos);
        Task<Palestrante[]> GetAllPalestrantesAsync(bool includeEventos);
        Task<Palestrante> GetAllPalestrantesIdAsync(int palestranteId, bool includeEventos);

    }
}
