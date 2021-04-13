using BC = BCrypt.Net.BCrypt;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using AccessControl.Domain;
using AccessControl.Repository;
using AccessControl.WebAPI.Dtos;
using AccessControl.WebAPI.Services;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace AccessControl.WebAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UsuarioController : ControllerBase
    {
        private readonly IAccessControlRepository _repo;
        private readonly IMapper _mapper;
        private IConfiguration _config;
        private readonly ITokenService _tokenService;
        public UsuarioController(IAccessControlRepository repo, IMapper mapper, IConfiguration config, ITokenService tokenService)
        {
            _mapper = mapper;
            _repo = repo;
            _config = config;
            _tokenService = tokenService;
        }

        [HttpGet]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> Get()
        {
            try
            {
                var usuarios = await _repo.GetAllUsuarioAsync();
                var results = _mapper.Map<IEnumerable<UsuarioDto>>(usuarios);

                return Ok(results);
            }
            catch (System.Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de dados falhou.");
            }
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Administrador, Agendador, Autorizador, Liberador")]
        public async Task<IActionResult> Get(int id)
        {
            try
            {
                var usuario = await _repo.GetUsuarioByIdAsync(id);
                var result = _mapper.Map<UsuarioDto>(usuario);

                if (result == null) return NotFound();

                result.Senha = "";
                return Ok(result);
            }
            catch (System.Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de dados falhou.");
            }
        }

        [HttpPost]
        [Route("login")]
        public async Task<ActionResult<dynamic>> Authenticate(UsuarioDto model)
        {
            var usuario = await _repo.GetUsuarioAsync(model.Conta);

            if (usuario == null || !BC.Verify(model.Senha, usuario.Senha))
                return NotFound(new { message = "Usuário ou senha inválidos " });

            var token = _tokenService.GenerateToken(usuario);

            usuario.Senha = "";

            return new
            {
                id = usuario.Id,
                conta = usuario.Conta,
                funcao = usuario.Funcao,
                token = token
            };
        }

        [HttpPost]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> Post(UsuarioDto model)
        {
            try
            {
                var conta = await _repo.GetUsuarioAsync(model.Conta);
                if (conta == null)
                {
                    var usuario = _mapper.Map<Usuario>(model);
                    DateTime now = DateTime.Now;
                    usuario.DataCadastro = now;
                    usuario.Senha = BC.HashPassword(model.Senha);
                    _repo.Add(usuario);

                    if (await _repo.SaveChangesAsync())
                    {
                        return Created($"/usuario/{model.Id}", _mapper.Map<UsuarioDto>(model));
                    }
                }
            }
            catch (System.Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de dados falhou.");
            }

            return BadRequest();
        }

        [HttpPut]
        [Route("changepassword/{id}")]
        [Authorize(Roles = "Administrador, Agendador, Autorizador, Liberador")]
        public async Task<IActionResult> ChangePassword(int id, UsuarioDto model)
        {
            try
            {
                var usuario = await _repo.GetUsuarioByIdAsync(id);

                if (usuario == null || !BC.Verify(model.Senha, usuario.Senha)) return NotFound();

                _mapper.Map(model, usuario);

                usuario.Senha = BC.HashPassword(model.NovaSenha);
                _repo.Update(usuario);

                if (await _repo.SaveChangesAsync())
                {
                    usuario.Senha = "";
                    return Created($"/usuario/{model.Id}", _mapper.Map<UsuarioDto>(usuario));
                }
            }
            catch (System.Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de dados falhou.");
            }

            return BadRequest();
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> Put(int id, UsuarioDto model)
        {
            try
            {
                var usuario = await _repo.GetUsuarioByIdAsync(id);

                if (usuario == null) return NotFound();

                string senhaAtual = usuario.Senha;

                _mapper.Map(model, usuario);

                if (model.Senha != "")
                {
                    usuario.Senha = BC.HashPassword(model.Senha);
                }
                else
                {
                    usuario.Senha = senhaAtual;
                }

                _repo.Update(usuario);

                if (await _repo.SaveChangesAsync())
                {
                    return Created($"/usuario/{model.Id}", _mapper.Map<UsuarioDto>(usuario));
                }
            }
            catch (System.Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de dados falhou.");
            }

            return BadRequest();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var usuario = await _repo.GetUsuarioByIdAsync(id);

                if (usuario == null) return NotFound();

                _repo.Delete(usuario);

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