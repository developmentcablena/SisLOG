using System;
using System.Collections.Generic;

namespace AccessControl.Domain
{
    public class NotaFiscal
    {
        public int Id { get; set; }
        public int NF { get; set; }
        public string Fornecedor { get; set; }
        public string Cidade { get; set; }
        public string UF { get; set; }
        public string Transportadora { get; set; }
        public decimal Valor { get; set; }
        public string Material { get; set; }
        public int Frete { get; set; }
        public int Volumes { get; set; }
        public string TipoVolume { get; set; }
        public decimal Peso { get; set; }
        public string Pedido { get; set; }
        public decimal KM { get; set; }
        public int Status { get; set; }
        public DateTime DataCadastro { get; set; }
        public int UsuarioId { get; set; }
        public Usuario Usuario { get; }
        public List<Agendamento> Agendamentos { get; set; }
    }
}