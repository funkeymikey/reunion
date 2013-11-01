using System.Web.Mvc;
using System.Web.Routing;

namespace FlickrTokenGenerator
{
  // Note: For instructions on enabling IIS6 or IIS7 classic mode, 
  // visit http://go.microsoft.com/?LinkId=9394801

  public class MvcApplication : System.Web.HttpApplication
  {
    protected void Application_Start()
    {
      //routes    
      RouteTable.Routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
      RouteTable.Routes.MapRoute(
          name: "Default",
          url: "{controller}/{action}/{id}",
          defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
      );

    }
  }
}