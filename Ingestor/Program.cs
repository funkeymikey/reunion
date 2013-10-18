using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace Ingestor
{
    class Program
    {
        static void Main(string[] args)
        {
            string[] emails = File.ReadAllLines("../../Emails.txt");

            new Program().LoadEmails(emails);

            Console.WriteLine();
            Console.WriteLine("Completed");
            Console.Read();
        }

        public void LoadEmails(string[] emails)
        {
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
                    Console.Error.WriteLine(response.StatusCode + "\t" + response.ReasonPhrase);
            }

        }
    }
}
