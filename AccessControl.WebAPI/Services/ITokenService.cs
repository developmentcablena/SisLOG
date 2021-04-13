using AccessControl.Domain;

namespace AccessControl.WebAPI.Services
{
    public interface ITokenService
    {
        string GenerateToken(Usuario usuario);
    }
}