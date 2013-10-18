using System.Threading.Tasks;
using System.Web.Http;
using Microsoft.WindowsAzure.Storage.Blob;

namespace EmailService.Controllers
{
    public class EmailController : EmailBaseController
    {
        public async Task<dynamic> Get(string email)
        {
            CloudBlockBlob emailBlob = this.GetEmailBlob();
            string emails = await emailBlob.DownloadTextAsync();

            if (!emails.Contains(email))
                return new { result = false };

            return new { result = true };
        }

        public async Task<dynamic> Post([FromBody]string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                return new { result = false, reason = "null input" };

            CloudBlockBlob emailBlob = this.GetEmailBlob();
            string emails = await emailBlob.DownloadTextAsync();

            //if it already exists, just leave
            if (emails.Contains(email))
                return new { result = false, reason="Already Exists" };

            //insert a newline delimiter
            emails += "\n" + email;

            await emailBlob.UploadTextAsync(emails);

            return new { result = true };
        }

    }
}