using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http;
using System.Net.Http.Headers;

namespace Ingestor
{
    public class Program
    {
        public static void Main(string[] args)
        {
            string[] emails = File.ReadAllLines("../../Emails.txt");

            //do it
            bool success = new Program().LoadEmails(emails);

            string message = success ? "Completed successfully" : "Completed with errors";
                
            Console.WriteLine();
            Console.WriteLine(message);
            
            if (!success)
                Console.Read();
        }

        public bool LoadEmails(string[] emails)
        {
            bool completedSuccessfully = true;

            //set up the client
            HttpClient client = new HttpClient();
            client.BaseAddress = new Uri("http://reunionemailservice.azurewebsites.net/");
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            //loop through all
            List<string> alreadySeen = new List<string>();
            foreach (string email in emails)
            {
                if (alreadySeen.Contains(email))
                    continue;

                alreadySeen.Add(email);
                Console.WriteLine(email);

                //Do a POST
                HttpContent content = new StringContent("\"" + email + "\"");
                content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
                HttpResponseMessage response = client.PostAsync("Email", content).Result;

                if (!response.IsSuccessStatusCode)
                {
                    completedSuccessfully = false;
                    Console.Error.WriteLine(response.StatusCode + "\t" + response.ReasonPhrase);
                }
            }

            return completedSuccessfully;
        }
    }
}
