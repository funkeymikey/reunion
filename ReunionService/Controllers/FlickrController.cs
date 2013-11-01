using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Web.Http;

namespace EmailService.Controllers
{
  public class FlickrController : ApiController
  {
    public dynamic Get()
    {

     
      //string q = Request.RequestUri.Query;

      //var dictionary = this.GetQueryParameters(q);

      //dictionary.Add("api_key", "3ed6bbf8fa206252c06d3710a96dac86");
      //dictionary.Add("nojsoncallback","1");      
      //dictionary.Add("format", "json");

      //string signature = this.GenerateApiSignature(dictionary, "59362e5e470f8a86");
      //dictionary.Add("api_sig", signature);

      //dynamic eoDynamic = this.ToDynamic(dictionary);

      //return eoDynamic;
      return null;
    }

    private dynamic ToDynamic(IDictionary<string, object> dictionary)
    {
      ExpandoObject eo = new ExpandoObject();
      ICollection<KeyValuePair<string, object>> eoColl = (ICollection<KeyValuePair<string, object>>)eo;

      foreach (var kvp in dictionary)
        eoColl.Add(kvp);

      dynamic eoDynamic = eo;
      return eoDynamic;
    }

    protected IDictionary<string, object> GetQueryParameters(string queryString)
    {
      var retval = new Dictionary<string, object>();
      foreach (var item in queryString.TrimStart('?').Split(new[] { '&' }, StringSplitOptions.RemoveEmptyEntries))
      {
        var split = item.Split('=');
        retval.Add(split[0], split[1]);
      }
      return retval;
    }

    

  }
}
