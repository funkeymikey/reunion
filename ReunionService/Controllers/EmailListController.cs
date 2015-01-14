using System.Collections.Generic;
using System.Threading.Tasks;

namespace EmailService.Controllers
{
    /// <summary>
    /// this method is split out so that people don't find it in the endpoint.  Of course the code is on github, so it's not that secret
    /// </summary>
    public class EmailListController : EmailBaseController
    {
        // GET api/values
        public async Task<IEnumerable<string>> Get()
        {
					return await this.GetEmails();
        }
    }
}