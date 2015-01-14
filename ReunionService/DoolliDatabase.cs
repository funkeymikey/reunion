using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmailService
{
    public class DoolliDatabase
    {
        //List<DoolliCategory> Categories { get; private set; }
        //List<DoolliKeyword> Keywords { get; private set; }

        [JsonProperty("content_fields")]
        public List<DoolliField> Fields { get; set; }
        
        [JsonProperty("items")]
        public List<DoolliItem> Items { get; set; }
    }
}
