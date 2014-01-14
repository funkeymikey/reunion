
namespace FlickrUtilities
{
  public class FlickrApiLocation
  {
    
    public static readonly FlickrApiLocation MAIN = new FlickrApiLocation("http://api.flickr.com/services/rest/");
    public static readonly FlickrApiLocation UPLOAD = new FlickrApiLocation("http://up.flickr.com/services/upload/");

    public string Uri { get; private set; }
    private FlickrApiLocation(string uri){
      this.Uri = uri;
    }

  }
}
