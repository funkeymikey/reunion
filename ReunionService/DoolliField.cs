using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace EmailService
{
    public class DoolliField
    {
        [JsonProperty("field_id")]
        public long FieldId { get; set; }

        [JsonProperty("cloned_from")]
        public long? ClonedFrom { get; set; }

        [JsonProperty("field_name")]
        public string FieldName { get; set; }

        [JsonProperty("sequence")]
        public int Sequence { get; set; }
        
        [JsonProperty("field_type_id")]
        public long FieldTypeId { get; set; }

        [JsonProperty("type")]
        public string FieldType { get; set; }

        [JsonProperty("subtype")]
        public string Subtype { get; set; }

        [JsonProperty("options")]
        public List<Object> Options { get; set; }

        [JsonProperty("is_required")]
        public bool IsRequired { get; set; }
        
        [JsonProperty("default_value")]
        public string DefaultValue { get; set; }
    }
}
