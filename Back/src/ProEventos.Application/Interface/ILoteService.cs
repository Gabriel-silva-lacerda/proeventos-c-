using Application.Dtos;
using ProEventos.Dtos;
using System.Threading.Tasks;

namespace Application.Interface
{
    public interface ILoteService
    {
        Task<LoteDto[]> SaveLotes(int eventoId, LoteDto[] models);
        Task<bool> DeleteLote(int eventoId, int loteId);
        Task<LoteDto[]> GetLotesByEventoIdAsync(int eventoId);     
        Task<LoteDto> GetLoteByIdsAsync(int eventoId, int loteId );
    }
}
