using System;
using System.Collections.Generic;

namespace AccessControl.Domain
{
    public class Agendamento
    {
        public int Id { get; set; }
        public string Motorista { get; set; }
        public string Documento { get; set; }
        public string Placa { get; set; }
        public DateTime DataCadastro { get; set; }
        public DateTime? DataEntrada { get; set; }
        public DateTime? DataSaida { get; set; }
        public int Status { get; set; }
        public int? AprovadorId { get; set; }
        public DateTime? DataAprovacao { get; set; }
        public int? LiberadorId { get; set; }
        public DateTime? DataLiberacaoChegada { get; set; }
        public DateTime? DataLiberacaoEntrada { get; set; }
        public DateTime? DataLiberacaoSaida { get; set; }
        public int UsuarioId { get; set; }
        public Usuario Usuario { get; }
        public int NotaFiscalId { get; set; }
        public NotaFiscal NotaFiscal { get; }
    }
}