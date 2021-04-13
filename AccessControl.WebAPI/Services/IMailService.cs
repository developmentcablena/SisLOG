using System.Threading.Tasks;
using AccessControl.Domain;

namespace AccessControl.WebAPI.Services
{
    public interface IMailService
    {
        Task SendEmailAsync(MailRequest mailRequest);
    }
}