using FlickrUtilities;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace EmailService.Controllers
{
  public class FlickrController : ApiController
  {
    #region Config Values
    private string ApiKey { get { return ConfigurationManager.AppSettings["FlickrApiKey"]; } }
    private string Secret { get { return ConfigurationManager.AppSettings["FlickrApiSecret"]; } }
    private string AuthToken { get { return ConfigurationManager.AppSettings["FlickrAuthToken"]; } }
    #endregion

    private FlickrHelper _flickrHelper;
    private FlickrHelper FlickrHelper
    {
      get
      {
        if (_flickrHelper == null)
          _flickrHelper = new FlickrHelper(this.ApiKey, this.Secret, this.AuthToken);
        return _flickrHelper;
      }
    }

    public async Task<dynamic> Post(JObject options)
    {
      Dictionary<string, object> dictionary = new Dictionary<string, object>();
      foreach (JProperty prop in options.Properties())
        dictionary.Add(prop.Name, prop.Value.ToString());

      dynamic result = await this.FlickrHelper.Post(dictionary);
      return result;
    }

    public async Task<dynamic> Get()
    {
      Dictionary<string, object> dictionary = Request.GetQueryNameValuePairs().ToDictionary(kv => kv.Key, kv=> (object)kv.Value);
      
      dynamic result = await this.FlickrHelper.Get(dictionary);
      return result;
    }


  }
}
