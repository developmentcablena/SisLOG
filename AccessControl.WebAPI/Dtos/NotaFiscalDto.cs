using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace AccessControl.WebAPI.Dtos
{
    public class NotaFiscalDto
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "O campo {0} é obrigatório.")]
        public int NF { get; set; }
        [Required(ErrorMessage = "O campo {0} é obrigatório.")]
        public string Fornecedor { get; set; }
        [Required(ErrorMessage = "O campo {0} é obrigatório.")]
        public string Cidade { get; set; }
        [Required(ErrorMessage = "O campo {0} é obrigatório.")]
        public string UF { get; set; }
        [Required(ErrorMessage = "O campo {0} é obrigatório.")]
        public string Transportadora { get; set; }
        [Required(ErrorMessage = "O campo {0} é obrigatório.")]
        public decimal Valor { get; set; }
        [Required(ErrorMessage = "O campo {0} é obrigatório.")]
        public string Material { get; set; }
        [Required(ErrorMessage = "O campo {0} é obrigatório.")]
        public int Frete { get; set; }
        [Required(ErrorMessage = "O campo {0} é obrigatório.")]
        public int Volumes { get; set; }
        [Required(ErrorMessage = "O campo {0} é obrigatório.")]
        public decimal Peso { get; set; }
        [Required(ErrorMessage = "O campo {0} é obrigatório.")]
        public string Pedido { get; set; }
        public decimal KM { get; set; }
        public string TipoVolume { get; set; }
        public int Status { get; set; }
        public int UsuarioId { get; set; }
        public string DataCadastro { get; set; }
        public List<AgendamentoDto> Agendamentos { get; set; }
    }
}