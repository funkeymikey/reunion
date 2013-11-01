using System.Configuration;
using System.IO;
using System.Web.Http;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;

namespace EmailService
{
  public class EmailBaseController : ApiController
  {
    private string AccountName
    {
      get { return ConfigurationManager.AppSettings["AzureStorageAccountName"]; }
    }

    private string AccountKey
    {
      get { return ConfigurationManager.AppSettings["AzureStorageAccountKey"]; }
    }

    protected CloudBlockBlob GetEmailBlob()
    {

      string connectionString = "DefaultEndpointsProtocol=https;AccountName=" + this.AccountName + "AccountKey=" + this.AccountKey;
      CloudStorageAccount storageAccount = CloudStorageAccount.Parse(ConfigurationManager.ConnectionStrings["ReunionStorage"].ConnectionString);
      
      CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

      // Retrieve a reference to a container. 
      CloudBlobContainer container = blobClient.GetContainerReference("emails");

      if (!container.Exists())
      {
        // Create the container if it doesn't already exist.
        container.CreateIfNotExists();

        container.SetPermissions(new BlobContainerPermissions { PublicAccess = BlobContainerPublicAccessType.Blob });
      }

      // Retrieve reference to a blob named "myblob".
      CloudBlockBlob emailBlob = container.GetBlockBlobReference("emails.txt");

      if (!emailBlob.Exists())
      {
        //load an empty memory stream. Will create an empty blob.
        using (MemoryStream ms = new MemoryStream())
          emailBlob.UploadFromStream(ms);
      }

      return emailBlob;
    }

  }
}