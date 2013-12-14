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
  /// <summary>
  /// This class provides a wrapper around the flickr api to easily make GET / POST calls
  /// </summary>
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

    /// <summary>
    /// Will POST any parameters passed in to the flickr service
    /// </summary>
    /// <param name="options">A Json object to pass to flickr.  Usually a contains the "method" key, as well as any required parameters </param>
    /// <returns></returns>
    public async Task<dynamic> Post(JObject options)
    {
      //convert the JObject's properties to a dictionary
      Dictionary<string, object> dictionary = options.Properties().ToDictionary(prop => prop.Name, prop => (object)prop.Value.ToString());
      
      //delegate to the flickr helper
      dynamic result = await this.FlickrHelper.Post(dictionary);
      return result;
    }

    /// <summary>
    /// Will GET any parameters in the query string to the flickr service
    /// </summary>
    /// <returns></returns>
    public async Task<dynamic> Get()
    {
      //convert the query string to a dictionary
      Dictionary<string, object> dictionary = Request.GetQueryNameValuePairs().ToDictionary(kv => kv.Key, kv=> (object)kv.Value);
      
      dynamic result = await this.FlickrHelper.Get(dictionary);
      return result;
    }


  }
}
