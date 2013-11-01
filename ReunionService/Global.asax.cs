using System;
using System.Web.Http;

namespace EmailService
{
  // Note: For instructions on enabling IIS6 or IIS7 classic mode, 
  // visit http://go.microsoft.com/?LinkId=9394801

  public class WebApiApplication : System.Web.HttpApplication
  {
    protected void Application_Start()
    {
      WebApiConfig.Register(GlobalConfiguration.Configuration);

    }

    /// <summary>
    /// Before we send out the results, check if this is a CORS request, add necessary headers
    /// </summary>
    protected void Application_PreRequestHandlerExecute()
    {
        if (Request.IsCorsRequest())
            this.AddCorsHeaders();
    }

    /// <summary>
    /// Adds the following headers to the response:
    ///     Access-Control-Allow-Origin
    ///     Access-Control-Allow-Credentials
    ///     Access-Control-Allow-Methods
    ///     Access-Control-Allow-Headers
    /// </summary>
    private void AddCorsHeaders()
    {
        //enable the CORS requests, but SignalR automatically adds these if necessary, so check for that
        if (Request.Url.LocalPath.StartsWith("/signalr", StringComparison.InvariantCultureIgnoreCase))
            return;

        Response.Headers["Access-Control-Allow-Origin"] = Request.Headers["Origin"];
        if (String.IsNullOrWhiteSpace(Response.Headers["Access-Control-Allow-Credentials"]))
            Response.Headers["Access-Control-Allow-Credentials"] = "true";
        if (String.IsNullOrWhiteSpace(Response.Headers["Access-Control-Allow-Methods"]))
            Response.Headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS";
        if (String.IsNullOrWhiteSpace(Response.Headers["Access-Control-Allow-Headers"]))
            Response.Headers["Access-Control-Allow-Headers"] = "Content-Type, Accept, X-Requested-With";

    }

  }
}