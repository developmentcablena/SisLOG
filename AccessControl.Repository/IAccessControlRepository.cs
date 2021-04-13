using System.Threading.Tasks;
using AccessControl.Domain;

namespace AccessControl.Repository
{
    public interface IAccessControlRepository
    {
        void Add<T>(T entity) where T : class;
        void Update<T>(T entity) where T : class;
        void Delete<T>(T entity) where T : class;
        Task<bool> SaveChangesAsync();
        Task<NotaFiscal[]> GetAllNotaFiscalAsync();
        Task<NotaFiscal[]> GetAllNotaFiscalForScheduleAsync();
        Task<NotaFiscal[]> GetAllNotaFiscalForAuthorizationAsync();
        Task<NotaFiscal[]> GetAllNotaFiscalForReleaseAsync();
        Task<NotaFiscal> GetNotaFiscalByIdAsync(int id);
        Task<Usuario[]> GetAllUsuarioAsync();
        Task<Usuario> GetUsuarioByIdAsync(int id);
        Task<Usuario> GetUsuarioAsync(string conta);
        Task<Agendamento[]> GetAllAgendamentoAsync();
        Task<Agendamento> GetAgendamentoByIdAsync(int id);
    }
}