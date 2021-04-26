using System.Collections.Generic;
using System.Threading.Tasks;
using AccessControl.Domain;
using AccessControl.Repository;
using AccessControl.WebAPI.Dtos;
using AccessControl.WebAPI.Services;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AccessControl.WebAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AgendamentoController : ControllerBase
    {
        private readonly IAccessControlRepository _repo;
        private readonly IMapper _mapper;
        private readonly IMailService _mail;
        public AgendamentoController(IAccessControlRepository repo, IMapper mapper, IMailService mail)
        {
            _mapper = mapper;
            _repo = repo;
            _mail = mail;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> Get()
        {
            try
            {
                var agendamentos = await _repo.GetAllAgendamentoAsync();
                var results = _mapper.Map<AgendamentoDto[]>(agendamentos);

                return Ok(results);
            }
            catch (System.Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de dados falhou.");
            }
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> Get(int id)
        {
            try
            {
                var agendamento = await _repo.GetAgendamentoByIdAsync(id);
                var result = _mapper.Map<AgendamentoDto>(agendamento);

                if (result == null) return NotFound();

                return Ok(result);
            }
            catch (System.Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de dados falhou.");
            }
        }

        [HttpPost]
        [Authorize(Roles = "Administrador, Agendador, Autorizador")]
        public async Task<IActionResult> Post(AgendamentoDto model)
        {
            try
            {
                var agendamento = _mapper.Map<Agendamento>(model);

                _repo.Add(agendamento);

                if (await _repo.SaveChangesAsync())
                {
                    await _mail.SendEmailAsync(
                        new MailRequest
                        {
                            ToEmail = "sislog_autorizar_telecom@cablenadobrasil.com.br",
                            Subject = "SISLOG - Novo agendamento cadastrado",
                            Body = "Acesse o sistema para <strong>liberar</strong> o recebimento.<br>http://192.168.0.249:5400"
                        }
                    );

                    return Created($"/agendamento/{model.Id}", _mapper.Map<AgendamentoDto>(model));
                }
            }
            catch (System.Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de dados falhou.");
            }

            return BadRequest();
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> Put(int id, AgendamentoDto model)
        {
            try
            {
                var agendamento = await _repo.GetAgendamentoByIdAsync(id);

                if (agendamento == null) return NotFound();

                _mapper.Map(model, agendamento);

                _repo.Update(agendamento);

                if (await _repo.SaveChangesAsync())
                {
                    await _mail.SendEmailAsync(
                        new MailRequest
                        {
                            ToEmail = "sislog_autorizar_telecom@cablenadobrasil.com.br",
                            Subject = "SISLOG - Agendamento atualizado",
                            Body = "Acesse o sistema para <strong>liberar</strong> o recebimento.<br>http://192.168.0.249:5400"
                        }
                    );

                    return Created($"/agendamento/{model.Id}", _mapper.Map<AgendamentoDto>(agendamento));
                }
            }
            catch (System.Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de dados falhou.");
            }

            return BadRequest();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrador, Agendador, Autorizador")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var agendamento = await _repo.GetAgendamentoByIdAsync(id);

                if (agendamento == null) return NotFound();

                _repo.Delete(agendamento);

                if (await _repo.SaveChangesAsync())
                {
                    return NoContent();
                }
            }
            catch (System.Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de dados falhou.");
            }

            return BadRequest();
        }
    }
}