using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EmailService.Controllers
{
  /// <summary>
  /// this method is split out so that people don't find it.  Of course the code is on github, so it's not that secret
  /// </summary>
  public class EmailListController : EmailBaseController
  {
    // GET api/values
    public async Task<IEnumerable<string>> Get()
    {
      //get all the email addresses we have
      string emailFile = await this.GetEmailBlob().DownloadTextAsync();

      //split it on the newlines
      IEnumerable<string> emails = emailFile.Split(new string[] { "\n" }, StringSplitOptions.RemoveEmptyEntries);

      //return results
      return emails;
    }
  }
}