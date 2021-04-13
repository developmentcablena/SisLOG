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
    public class NotaFiscalController : ControllerBase
    {
        private readonly IAccessControlRepository _repo;
        private readonly IMapper _mapper;
        private readonly IMailService _mail;
        public NotaFiscalController(IAccessControlRepository repo, IMapper mapper, IMailService mail)
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
                var notasfiscais = await _repo.GetAllNotaFiscalAsync();
                var results = _mapper.Map<IEnumerable<NotaFiscalDto>>(notasfiscais);

                return Ok(results);
            }
            catch (System.Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de dados falhou.");
            }
        }

        [HttpGet]
        [Route("agendar")]
        [Authorize(Roles = "Administrador, Agendador, Autorizador")]
        public async Task<IActionResult> GetNotaFiscalForSchedule()
        {
            try
            {
                var notasfiscais = await _repo.GetAllNotaFiscalForScheduleAsync();
                var results = _mapper.Map<IEnumerable<NotaFiscalDto>>(notasfiscais);

                return Ok(results);
            }
            catch (System.Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de dados falhou.");
            }
        }

        [HttpGet]
        [Route("autorizar")]
        [Authorize(Roles = "Administrador, Autorizador")]
        public async Task<IActionResult> GetNotaFiscalForAuthorization()
        {
            try
            {
                var notasfiscais = await _repo.GetAllNotaFiscalForAuthorizationAsync();
                var results = _mapper.Map<IEnumerable<NotaFiscalDto>>(notasfiscais);

                return Ok(results);
            }
            catch (System.Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de dados falhou.");
            }
        }

        [HttpGet]
        [Route("liberar")]
        [Authorize(Roles = "Administrador, Liberador")]
        public async Task<IActionResult> GetNotaFiscalForRelease()
        {
            try
            {
                var notasfiscais = await _repo.GetAllNotaFiscalForReleaseAsync();
                var results = _mapper.Map<IEnumerable<NotaFiscalDto>>(notasfiscais);

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
                var notafiscal = await _repo.GetNotaFiscalByIdAsync(id);
                var result = _mapper.Map<NotaFiscalDto>(notafiscal);

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
        public async Task<IActionResult> Post(NotaFiscalDto model)
        {
            try
            {
                var notafiscal = _mapper.Map<NotaFiscal>(model);

                _repo.Add(notafiscal);

                if (await _repo.SaveChangesAsync())
                {
                    await _mail.SendEmailAsync(
                        new MailRequest
                        {
                            ToEmail = "rsaito@cablena.com.br",
                            Subject = "SISLOG - Nova nota fiscal cadastrada",
                            Body = "Acesse o sistema para <strong>agendar</strong> o recebimento.<br>http://localhost:3000/main"
                        }
                    );

                    return Created($"/notafiscal/{model.Id}", _mapper.Map<NotaFiscalDto>(model));
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
        public async Task<IActionResult> Put(int id, NotaFiscalDto model)
        {
            try
            {
                var notafiscal = await _repo.GetNotaFiscalByIdAsync(id);

                if (notafiscal == null) return NotFound();

                _mapper.Map(model, notafiscal);

                _repo.Update(notafiscal);

                if (await _repo.SaveChangesAsync())
                {
                    return Created($"/notafiscal/{model.Id}", _mapper.Map<NotaFiscalDto>(notafiscal));
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
                var notafiscal = await _repo.GetNotaFiscalByIdAsync(id);

                if (notafiscal == null) return NotFound();

                _repo.Delete(notafiscal);

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
