using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EmailService.Controllers
{
    public class EmailController : EmailBaseController
    {
        public async Task<dynamic> Get(string email)
        {
					IEnumerable<String> emails = await this.GetEmails();
					
					if(emails.Contains(email.ToLower(), StringComparer.InvariantCultureIgnoreCase))
						return new { result = true };

					return new { result = false };
        }

    }
}