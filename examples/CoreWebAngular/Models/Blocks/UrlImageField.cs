using Newtonsoft.Json;
using Piranha.Extend.Fields;

namespace CoreWebAngular.Models.Blocks
{
    public class UrlImageField : ImageField
    {
        /// <summary>
        /// Gets/sets the optional image url.
        /// </summary>
        public StringField Url { get; set; }

        [JsonIgnore]
        public int Size { get; set; }
    }
}
