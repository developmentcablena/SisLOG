using AccessControl.Domain;
using Microsoft.EntityFrameworkCore;

namespace AccessControl.Repository
{
    public class AccessControlContext : DbContext
    {
        public AccessControlContext(DbContextOptions<AccessControlContext> options) : base(options) { }
        public DbSet<NotaFiscal> NotasFiscais { get; set; }
        public DbSet<Agendamento> Agendamentos { get; set; }
        public DbSet<Usuario> Usuarios { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<NotaFiscal>()
                .Property(p => p.KM)
                .HasColumnType("decimal(18,2)");
            modelBuilder.Entity<NotaFiscal>()
                .Property(p => p.Peso)
                .HasColumnType("decimal(18,2)");
            modelBuilder.Entity<NotaFiscal>()
                .Property(p => p.Valor)
                .HasColumnType("decimal(18,2)");
        }
    }
}