using System.ComponentModel.DataAnnotations;

namespace AccessControl.WebAPI.Dtos
{
    public class AgendamentoDto
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "O campo {0} é obrigatório.")]
        public string Motorista { get; set; }
        [Required(ErrorMessage = "O campo {0} é obrigatório.")]
        public string Documento { get; set; }
        public string Placa { get; set; }
        public string DataCadastro { get; set; }
        public string DataEntrada { get; set; }
        public string DataSaida { get; set; }
        public string DataAprovacao { get; set; }
        public int? AprovadorId { get; set; }
        public string DataLiberacaoChegada { get; set; }
        public string DataLiberacaoEntrada { get; set; }
        public string DataLiberacaoSaida { get; set; }
        public int? LiberadorId { get; set; }
        public int NotaFiscalId { get; set; }
        public int UsuarioId { get; set; }
    }
}