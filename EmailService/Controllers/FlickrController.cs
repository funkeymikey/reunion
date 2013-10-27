using FlickrNet;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Globalization;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace EmailService.Controllers
{
  public class FlickrController : ApiController
  {
    public dynamic Get()
    {

     // Flickr
      //var thing = new Flickr("3ed6bbf8fa206252c06d3710a96dac86", "59362e5e470f8a86").token

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

    private string GenerateApiSignature(IDictionary<string, object> parameters, string secret)
    {
      SortedList<string, object> sorted = new SortedList<string, object>();
      foreach (KeyValuePair<string, object> pair in parameters)
      {
        sorted.Add(pair.Key, pair.Value);
      }

      StringBuilder sb = new StringBuilder(secret);
      foreach (KeyValuePair<string, object> pair in sorted)
      {
        sb.Append(pair.Key);
        sb.Append(pair.Value);
      }

      string signature = this.MD5Hash(sb.ToString());

      return signature;
    }

    private string MD5Hash(string data)
    {
      byte[] hashedBytes;

      using (MD5CryptoServiceProvider csp = new MD5CryptoServiceProvider())
      {
        byte[] bytes = Encoding.UTF8.GetBytes(data);
        hashedBytes = csp.ComputeHash(bytes, 0, bytes.Length);
      }

      return BitConverter.ToString(hashedBytes).Replace("-", String.Empty).ToLower(CultureInfo.InvariantCulture);
    }

  }
}
