using FlickrUtilities;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace EmailService.Controllers
{
  /// <summary>
  /// This class provides a wrapper around the flickr api to easily make GET / POST calls
  /// </summary>
  public class FlickrUploadController : ApiController
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


    public async Task<List<FlickrUploadResult>> Post()
    {
      // Verify that this is an HTML Form file upload request
      if (!Request.Content.IsMimeMultipartContent("form-data"))
      {
        throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);
      }

      //Stream provider to read the form posting
      MultipartMemoryStreamProvider streamProvider = await Request.Content.ReadAsMultipartAsync();

      List<FlickrUploadResult> photoIds = new List<FlickrUploadResult>();

      //for each part in the multi-part content
      foreach (HttpContent part in streamProvider.Contents)
      {
        //if there's no filename, then it's not a file
        if (part.Headers.ContentDisposition.FileName == null)
          continue;

        //get the file's name and stream
        string fileName = part.Headers.ContentDisposition.FileName.Trim('\"');
        Stream fileStream = await part.ReadAsStreamAsync();
        
        //upload it to flickr
        FlickrUploadResult uploadResult = await FlickrHelper.Upload(fileName, fileStream);
        photoIds.Add(uploadResult);
      }

      return photoIds;
    }

  }
}
