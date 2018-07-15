using Newtonsoft.Json;
using Piranha;
using Piranha.Extend;
using Piranha.Extend.Fields;
using System;

namespace CoreWebAngular.Models.Blocks
{
    [FieldType(Name = "Image", Shorthand = "Image")]
    public class UrlImageField : MediaFieldBase<ImageField>
    {
        [JsonIgnore]
        public int Size { get; set; }

        /// <summary>
        /// Implicit operator for converting a Guid id to a field.
        /// </summary>
        /// <param name="str">The string value</param>
        public static implicit operator UrlImageField(Guid guid)
        {
            return new UrlImageField { Id = guid };
        }

        /// <summary>
        /// Implicit operator for converting a media object to a field.
        /// </summary>
        /// <param name="media">The media object</param>
        public static implicit operator UrlImageField(Piranha.Data.Media media)
        {
            return new UrlImageField { Id = media.Id };
        }

        /// <summary>
        /// Impicit operator for converting the field to an url string.
        /// </summary>
        /// <param name="image">The image field</param>
        public static implicit operator string(UrlImageField image)
        {
            if (image.Media != null)
                return image.Media.PublicUrl;
            return "";
        }

        /// <summary>
        /// Gets the url for a resized version of the image.
        /// </summary>
        /// <param name="api">The api</param>
        /// <param name="width">The requested width</param>
        /// <param name="height">The optional height</param>
        /// <returns>The image url</returns>
        public string Resize(IApi api, int width, int? height = null)
        {
            if (Id.HasValue)
                return api.Media.EnsureVersion(Id.Value, width, height);
            return null;
        }

    }
}
