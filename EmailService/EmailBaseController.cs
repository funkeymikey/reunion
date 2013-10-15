﻿using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using System.Configuration;
using System.IO;
using System.Web.Http;

namespace EmailService
{
  public class EmailBaseController : ApiController
  {
    protected CloudBlockBlob GetEmailBlob()
    {

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
        //Empty memory stream. Will create an empty blob.
        using (MemoryStream ms = new MemoryStream())
          emailBlob.UploadFromStream(ms);
      }

      return emailBlob;
    }

  }
}