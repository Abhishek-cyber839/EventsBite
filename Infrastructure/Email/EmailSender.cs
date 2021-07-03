using Microsoft.Extensions.Configuration;
using SendGrid;
using SendGrid.Helpers.Mail;
using System.Threading.Tasks;

namespace Infrastructure.Email
{
    public class EmailSender
    {
        private readonly IConfiguration _config;
        public EmailSender(IConfiguration config){
            _config = config;
        }

        public async Task SendEmailAsync(string UserEmail,string EmailSubject,string Message){
            var client = new SendGridClient(_config["Sendgrid:Key"]);
            var message = new SendGridMessage{
                From = new EmailAddress("ak4290104@gmail.com",_config["Sendgrid:User"]),
                Subject = EmailSubject,
                PlainTextContent = Message,
                HtmlContent = Message
            };
            message.AddTo(new EmailAddress(UserEmail));
            message.SetClickTracking(false,false);
            await client.SendEmailAsync(message);
        }
    }
}