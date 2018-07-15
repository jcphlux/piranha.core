using System;
using CoreWebAngular.Models.Blocks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Piranha;

namespace CoreWebAngular.Converters
{
    public class ImageCoverter : JsonConverter
    {
        private IApi Api;
        public ImageCoverter(IApi api)
        {
            Api = api;
        }

        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            var img = (UrlImageField)value;

            JObject jo = new JObject();

            jo.Add(new JProperty("HasValue", img.HasValue));

            if (img.HasValue)
            {
                var url = (img.Size == 0 ? (string)img : img.Resize(Api, img.Size)).Substring(1);
                jo.Add(new JProperty("Url", url));
            }

            jo.WriteTo(writer);
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            throw new NotImplementedException();
        }

        public override bool CanConvert(Type objectType)
        {
            return typeof(UrlImageField).IsAssignableFrom(objectType);
        }
    }
}
