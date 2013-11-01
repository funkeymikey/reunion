using FlickrUtilities;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.Configuration;
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

    public async void Post(JObject options)
    {
      Dictionary<string, object> dictionary = new Dictionary<string, object>();
      foreach (JProperty prop in options.Properties())
      {
        dictionary.Add(prop.Name, prop.Value.ToString());
      }
      await this.FlickrHelper.Post(dictionary);
    }

    //protected IDictionary<string, object> GetQueryParameters(string queryString)
    //{
    //  var retval = new Dictionary<string, object>();
    //  foreach (var item in queryString.TrimStart('?').Split(new[] { '&' }, StringSplitOptions.RemoveEmptyEntries))
    //  {
    //    var split = item.Split('=');
    //    retval.Add(split[0], split[1]);
    //  }
    //  return retval;
    //}

  }
}
