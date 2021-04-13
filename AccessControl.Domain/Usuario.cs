using System;

namespace AccessControl.Domain
{
    public class Usuario
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public string Conta { get; set; }
        public string Senha { get; set; }
        public string Funcao { get; set; }
        public string Email { get; set; }
        public DateTime DataCadastro { get; set; }
        public int Status { get; set; }
    }
}