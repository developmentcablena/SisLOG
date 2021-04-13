using AccessControl.Domain;
using AccessControl.WebAPI.Dtos;
using AutoMapper;

namespace AccessControl.WebAPI.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<Agendamento, AgendamentoDto>().ReverseMap();
            CreateMap<NotaFiscal, NotaFiscalDto>().ReverseMap();
            CreateMap<Usuario, UsuarioDto>().ReverseMap();
        }
    }
}