using Newtonsoft.Json;
using System.Linq;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Net.Http;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace FlickrUtilities
{
  public class FlickrHelper
  {
    //public const string FlickrService = "http://api.flickr.com/services/rest/";

    public FlickrApiLocation FlickrApi { get; set; }
    public string ApiKey { get; set; }
    public string Secret { get; set; }
    public string AuthToken { get; set; }

    public FlickrHelper(string apiKey, string secret, string authToken = null)
      : this(FlickrApiLocation.MAIN, apiKey, secret, authToken) { }

    public FlickrHelper(FlickrApiLocation api, string apiKey, string secret, string authToken = null)
    {
      this.FlickrApi = api;
      this.ApiKey = apiKey;
      this.Secret = secret;
      this.AuthToken = authToken;
    }

    public string GenerateApiSignature(IDictionary<string, object> parameters)
    {
      //sort the parameters alphabetically
      SortedList<string, object> sorted = new SortedList<string, object>();
      foreach (KeyValuePair<string, object> pair in parameters)
        sorted.Add(pair.Key, pair.Value);

      //build up the string to hash, with the secret prepended
      StringBuilder sb = new StringBuilder(this.Secret);
      foreach (KeyValuePair<string, object> pair in sorted)
      {
        //skip the parameter if its name is "photo"
        if (pair.Key.Equals("photo", StringComparison.InvariantCultureIgnoreCase))
          continue;

        sb.Append(pair.Key);
        sb.Append(pair.Value);
      }

      //hash it
      string signature = MD5Hash(sb.ToString());

      return signature;
    }

    public string GenerateApiSignature(IDictionary<string, string> parameters)
    {
      //sort the parameters alphabetically
      SortedList<string, object> sorted = new SortedList<string, object>();
      foreach (KeyValuePair<string, string> pair in parameters)
        sorted.Add(pair.Key, pair.Value);

      //build up the string to hash, with the secret prepended
      StringBuilder sb = new StringBuilder(this.Secret);
      foreach (KeyValuePair<string, object> pair in sorted)
      {
        //skip the parameter if its name is "photo"
        if (pair.Key.Equals("photo", StringComparison.InvariantCultureIgnoreCase))
          continue;

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

    public async Task<dynamic> Get(Dictionary<string, object> parameters)
    {
      //add in the generic parameters
      parameters.Add("api_key", this.ApiKey);
      parameters.Add("nojsoncallback", "1");
      parameters.Add("format", "json");
      parameters.Add("api_sig", this.GenerateApiSignature(parameters));

      string url = this.BuildQueryStringUrl(this.FlickrApi.Uri, parameters);

      //make the call, get back a string of json
      HttpClient client = new HttpClient();
      string content = await client.GetStringAsync(url);

      //convert that to a dynamic object
      dynamic jsonObject = await JsonConvert.DeserializeObjectAsync<dynamic>(content);

      return jsonObject;
    }

    public dynamic Post(Dictionary<string, object> parameters)
    {
      //add in the generic parameters
      parameters.Add("api_key", this.ApiKey);
      
      if (!String.IsNullOrWhiteSpace(this.AuthToken)) parameters.Add("auth_token", this.AuthToken);
      parameters.Add("api_sig", this.GenerateApiSignature(parameters));


      if (this.FlickrApi == FlickrApiLocation.UPLOAD)
      {
        //Dictionary<string, string> paramStrings = parameters.ToDictionary(x => x.Key, x => (string)x.Value);
        MultipartFormDataContent  content = new MultipartFormDataContent();
        foreach(string key in parameters.Keys){
          content.Add(new StringContent(parameters[key].ToString()), key);
        }

        HttpClient uploadClient = new HttpClient();
        HttpResponseMessage uploadResponse = uploadClient.PostAsync(this.FlickrApi.Uri, content).Result;

        dynamic something = uploadResponse.Content.ReadAsAsync<dynamic>().Result;
        return something;
      }


      string url = this.BuildQueryStringUrl(this.FlickrApi.Uri, parameters);

      //make the call, get back a string of json
      //the posts on flickr take all the parameters in the query string, so we're passing null as the content
      HttpClient client = new HttpClient();
      HttpResponseMessage response =  client.PostAsync(url, null).Result;

      //convert that to a dynamic object
      dynamic jsonObject =  response.Content.ReadAsAsync<dynamic>().Result;

      return jsonObject;

    }

    public string BuildQueryStringUrl(string url, Dictionary<string, object> dictionary = null)
    {
      //if there's no parameters, return just the input
      if (dictionary == null)
        return url;

      //the result will be the input + the parameters in a query string
      StringBuilder sb = new StringBuilder(url + "?");
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