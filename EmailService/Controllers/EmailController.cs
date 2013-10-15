using Microsoft.WindowsAzure.Storage.Blob;
using System.Threading.Tasks;
using System.Web.Http;

namespace EmailService.Controllers
{
  public class EmailController : EmailBaseController
  {
    public async Task<string> Get(string email)
    {
      CloudBlockBlob emailBlob = this.GetEmailBlob();
      string emails = await emailBlob.DownloadTextAsync();

      if (!emails.Contains(email))
        return null;

      return email;
    }

    public async void Post([FromBody]string email)
    {
      CloudBlockBlob emailBlob = this.GetEmailBlob();
      string emails = await emailBlob.DownloadTextAsync();

      //if it already exists, just leave
      if (emails.Contains(email))
        return;

      //insert a newline delimiter
      emails += "\n" + email;

      await emailBlob.UploadTextAsync(emails);      
    }
    
  }
}