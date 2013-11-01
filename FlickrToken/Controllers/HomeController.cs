using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using System.Web.Mvc;
using System.Net.Http.Formatting;
using FlickrUtilities;
using System.Threading.Tasks;

namespace FlickrTokenGenerator.Controllers
{
    public class HomeController : Controller
    {

        public ActionResult Index()
        {
            return View();
        }


        public String ApiKey
        {
          get { return Session["API_KEY"] as String; }
          set { Session["API_KEY"] = value; }
        }

        public String Secret
        {
          get { return Session["SECRET"] as String; }
          set { Session["SECRET"] = value; }
        }
        
        public ActionResult GetToken(string apiKey, string secret, string permission)
        {
          this.ApiKey = apiKey;
          this.Secret = secret;

          FlickrHelper flelper = new FlickrHelper(this.ApiKey, this.Secret);
          
          Dictionary<string, object> parameters = new Dictionary<string, object>();
          parameters.Add("api_key", apiKey);
          parameters.Add("perms", permission);
          string signature = flelper.GenerateApiSignature(parameters);

          string loginUrl = "http://flickr.com/services/auth/?api_key=" + apiKey + "&perms=" + permission + "&api_sig=" + signature;
          
          return Redirect(loginUrl);            
        }

        public async Task<ActionResult> Result(string frob)
        {
          FlickrHelper flelper = new FlickrHelper(this.ApiKey, this.Secret);
          

          Dictionary<string, object> parameters = new Dictionary<string, object>();
          parameters.Add("method", "flickr.auth.getToken");
          parameters.Add("frob", frob);
          dynamic result = await flelper.CallMethod(parameters);


          return View(result);
        }

        string token = "72157637198668853-e5f2aef24301a3dd";


    }
}
