using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System.Web.Http;
using System.Web.Http.Cors;

namespace EmailService
{
  public class WebApiApplication : System.Web.HttpApplication
  {
    protected void Application_Start()
    {
      // Enable CORS
      EnableCorsAttribute cors = new EnableCorsAttribute("http://www.morinreunion.com,http://localhost:52529", "*", "*");
      GlobalConfiguration.Configuration.EnableCors(cors);

      //camelCase our outgoing javascript
      JsonSerializerSettings jsonSettings = GlobalConfiguration.Configuration.Formatters.JsonFormatter.SerializerSettings;
      jsonSettings.Formatting = Formatting.Indented;
      jsonSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();

      WebApiConfig.Register(GlobalConfiguration.Configuration);
    }

  }
}