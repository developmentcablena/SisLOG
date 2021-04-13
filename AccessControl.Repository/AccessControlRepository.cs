using System.Linq;
using System.Threading.Tasks;
using AccessControl.Domain;
using Microsoft.EntityFrameworkCore;

namespace AccessControl.Repository
{
    public class AccessControlRepository : IAccessControlRepository
    {
        private readonly AccessControlContext _context;
        public AccessControlRepository(AccessControlContext context)
        {
            _context = context;
        }
        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }
        public void Update<T>(T entity) where T : class
        {
            _context.Update(entity);
        }
        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }
        public async Task<bool> SaveChangesAsync()
        {
            return (await _context.SaveChangesAsync()) > 0;
        }
        public async Task<NotaFiscal[]> GetAllNotaFiscalAsync()
        {
            IQueryable<NotaFiscal> query = _context.NotasFiscais
                .Include(a => a.Agendamentos)
                .OrderByDescending(x => x.DataCadastro);

            return await query.ToArrayAsync();
        }
        public async Task<NotaFiscal[]> GetAllNotaFiscalForScheduleAsync()
        {
            IQueryable<NotaFiscal> query = _context.NotasFiscais
                .Include(a => a.Agendamentos)
                .Where(s => s.Status != 3)
                .OrderByDescending(x => x.DataCadastro);

            return await query.ToArrayAsync();
        }
        public async Task<NotaFiscal[]> GetAllNotaFiscalForAuthorizationAsync()
        {
            IQueryable<NotaFiscal> query = _context.NotasFiscais
                .Include(a => a.Agendamentos)
                .Where(s => s.Status == 1)
                .OrderByDescending(x => x.DataCadastro);

            return await query.ToArrayAsync();
        }
        public async Task<NotaFiscal[]> GetAllNotaFiscalForReleaseAsync()
        {
            IQueryable<NotaFiscal> query = _context.NotasFiscais
                .Include(a => a.Agendamentos)
                .Where(s => s.Status == 2)
                .OrderByDescending(x => x.DataCadastro);

            return await query.ToArrayAsync();
        }
        public async Task<NotaFiscal> GetNotaFiscalByIdAsync(int id)
        {
            IQueryable<NotaFiscal> query = _context.NotasFiscais
                .AsNoTracking()
                .Where(x => x.Id == id)
                .Include(a => a.Agendamentos)
                .OrderByDescending(x => x.DataCadastro);

            return await query.FirstOrDefaultAsync();
        }
        public async Task<Usuario[]> GetAllUsuarioAsync()
        {
            IQueryable<Usuario> query = _context.Usuarios;

            return await query.ToArrayAsync();
        }
        public async Task<Usuario> GetUsuarioByIdAsync(int id)
        {
            IQueryable<Usuario> query = _context.Usuarios
                .AsNoTracking()
                .Where(x => x.Id == id);

            return await query.FirstOrDefaultAsync();
        }
        public async Task<Usuario> GetUsuarioAsync(string conta)
        {
            IQueryable<Usuario> query = _context.Usuarios
                .AsNoTracking()
                .Where(x => x.Conta.ToLower() == conta.ToLower() && x.Status == 0);

            return await query.FirstOrDefaultAsync();
        }
        public async Task<Agendamento[]> GetAllAgendamentoAsync()
        {
            IQueryable<Agendamento> query = _context.Agendamentos;

            return await query.ToArrayAsync();
        }
        public async Task<Agendamento> GetAgendamentoByIdAsync(int id)
        {
            IQueryable<Agendamento> query = _context.Agendamentos
                .AsNoTracking()
                .Where(x => x.Id == id);

            return await query.FirstOrDefaultAsync();
        }
    }
}