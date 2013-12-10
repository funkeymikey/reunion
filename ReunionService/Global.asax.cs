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

      WebApiConfig.Register(GlobalConfiguration.Configuration);
    }

  }
}