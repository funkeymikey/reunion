using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace EmailService
{
	public class EmailBaseController : ApiController
	{
		protected string DoolliDatabaseId { get { return ConfigurationManager.AppSettings["DoolliDatabaseId"]; } }
		protected string DoolliApplicationKey { get { return ConfigurationManager.AppSettings["DoolliApplicationKey"]; } }

		protected async Task<IEnumerable<string>> GetEmails()
		{
			Uri endpoint = new Uri("https://api.doolli.com/databases/" + DoolliDatabaseId + "?application_key=" + DoolliApplicationKey);

			//get the dater
			HttpResponseMessage response = await new HttpClient().GetAsync(endpoint);
			response.EnsureSuccessStatusCode();

			//convert the data to a DoolliDatabase object
			DoolliDatabase db = await response.Content.ReadAsAsync<DoolliDatabase>();

			//find the id of the field named "Email"
			long fieldId = db.Fields.Single(f => f.FieldName == "Email").FieldId;

			//get the first value for every field with the matching ID
			IEnumerable<string> emails = db.Items.Select(i => i.FieldValues[fieldId][0]);

			return emails;
		}

	}
}