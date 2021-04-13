using System.ComponentModel.DataAnnotations;

namespace AccessControl.WebAPI.Dtos
{
    public class UsuarioDto
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public string Conta { get; set; }
        public string Senha { get; set; }
        public string NovaSenha { get; set; }
        public string Funcao { get; set; }
        public string Email { get; set; }
        public int Status { get; set; }
    }
}