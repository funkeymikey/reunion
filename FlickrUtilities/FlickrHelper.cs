using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace FlickrUtilities
{
  public class FlickrHelper
  {
    public string ApiKey { get; set; }
    public string Secret { get; set; }

    public FlickrHelper(string apiKey, string secret)
    {
      this.ApiKey = apiKey;
      this.Secret = secret;
    }

    public string GenerateApiSignature(IDictionary<string, object> parameters)
    {
      //sort the parameters alphabetically
      SortedList<string, object> sorted = new SortedList<string, object>();
      foreach (KeyValuePair<string, object> pair in parameters)
        sorted.Add(pair.Key, pair.Value);

      //build up the string to has, with the secret prepended
      StringBuilder sb = new StringBuilder(this.Secret);
      foreach (KeyValuePair<string, object> pair in sorted)
      {
        sb.Append(pair.Key);
        sb.Append(pair.Value);
      }

      //hash it
      string signature = MD5Hash(sb.ToString());

      return signature;
    }

    public static string MD5Hash(string data)
    {
      byte[] hashedBytes;

      using (MD5CryptoServiceProvider csp = new MD5CryptoServiceProvider())
      {
        byte[] bytes = Encoding.UTF8.GetBytes(data);
        hashedBytes = csp.ComputeHash(bytes, 0, bytes.Length);
      }

      return BitConverter.ToString(hashedBytes).Replace("-", String.Empty).ToLower(CultureInfo.InvariantCulture);
    }

    public async Task<dynamic> CallMethod(Dictionary<string, object> parameters)
    {
      //add in the generic parameters
      parameters.Add("api_key", this.ApiKey);
      parameters.Add("nojsoncallback", "1");
      parameters.Add("format", "json");
      parameters.Add("api_sig", this.GenerateApiSignature(parameters));

      string url = this.BuildGetUrl("http://api.flickr.com/services/rest/", parameters);

      //make the call, get back the url
      HttpClient client = new HttpClient();
      string content = await client.GetStringAsync(url);

      //convert that to a dynamic object
      dynamic jsonObject = await JsonConvert.DeserializeObjectAsync<dynamic>(content);

      return jsonObject;
    }

    public string BuildGetUrl(string url, Dictionary<string, object> dictionary = null)
    {
      //if there's no parameters, return just the input
      if (dictionary == null)
        return url;

      //the result will be the input + the parameters in a query string
      StringBuilder sb = new StringBuilder(url+ "?");
      foreach (KeyValuePair<string, object> pair in dictionary)
      {
        sb.Append(pair.Key);
        sb.Append("=");
        sb.Append(pair.Value);
        sb.Append("&");
      }

      //remove trailing '&'
      string newUrl = sb.Remove(sb.Length - 1, 1).ToString();

      return newUrl;
    }
  }

}