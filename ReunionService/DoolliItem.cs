using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace EmailService
{
    public class DoolliItem
    {
        [JsonProperty("content_item_id")]
        public long ContentItemId { get; set; }

        [JsonProperty("content_id")]
        public long ContentId { get; set; }

        [JsonProperty("field_values")]
        public Dictionary<long, List<string>> FieldValues { get; set; }
    }
}
