/*
 * Copyright (c) 2017 Håkan Edling
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE file for details.
 * 
 * http://github.com/tidyui/coreweb
 * 
 */

using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Piranha;
using System;

namespace CoreWebAngular.Controllers
{
    /// <summary>
    /// Simple controller for handling the CMS API content from Piranha.
    /// </summary>
    [Route("api/[controller]")]
    public class CmsController : Controller
    {
        /// <summary>
        /// The private api.
        /// </summary>
        private readonly IApi api;

        /// <summary>
        /// The private serializerSettings.
        /// </summary>
        private readonly JsonSerializerSettings serializerSettings;

        /// <summary>
        /// Default construtor.
        /// </summary>
        /// <param name="api">The current api</param>
        public CmsController(IApi api)
        {
            this.api = api;
            serializerSettings = new JsonSerializerSettings
            {
                Formatting = Formatting.Indented
            };
        }

        /// <summary>
        /// Gets the sitemap with the specified id or default sitemap if Empty.
        /// </summary>
        /// <param name="id">The unique id</param>
        [HttpGet("sitemap")]
        public IActionResult Sitemap(Guid id)
        {
            var model = Guid.Empty.Equals(id) ? api.Sites.GetSitemap() : api.Sites.GetSitemap(id);
            var json = JsonConvert.SerializeObject(model, serializerSettings);
            return new OkObjectResult(json);
        }

        /// <summary>
        /// Gets the archive for the category with the specified id.
        /// </summary>
        /// <param name="id">The category id</param>
        /// <param name="year">The optional year</param>
        /// <param name="month">The optional month</param>
        /// <param name="page">The optional page</param>
        /// <param name="category">The optional category id</param>
        [HttpGet("archive")]
        public IActionResult Archive(Guid id, int? year = null, int? month = null, int? page = null, Guid? category = null, Guid? tag = null)
        {
            CoreWebViewModels.BlogArchive model;

            if (category.HasValue)
                model = api.Archives.GetByCategoryId<CoreWebViewModels.BlogArchive>(id, category.Value, page, year, month);
            else if (tag.HasValue)
                model = api.Archives.GetByTagId<CoreWebViewModels.BlogArchive>(id, tag.Value, page, year, month);
            else model = api.Archives.GetById<CoreWebViewModels.BlogArchive>(id, page, year, month);
            //ViewBag.CurrentPage = model.Id;
            //ViewBag.SiteId = (Guid)HttpContext.Items["Piranha_SiteId"];

            //return View(model);
            var json = JsonConvert.SerializeObject(model, serializerSettings);
            return new OkObjectResult(json);
        }

        /// <summary>
        /// Gets the page with the specified id.
        /// </summary>
        /// <param name="id">The unique id</param>
        [HttpGet("page")]
        public IActionResult Page(Guid id)
        {
            var model = api.Pages.GetById<CoreWebViewModels.StandardPage>(id);
            if (model.Heading.PrimaryImage.HasValue)
            {
                model.Heading.ImageUrl = Url.Content((string)model.Heading.PrimaryImage);
            }
            //ViewBag.CurrentPage = model.Id;
            //ViewBag.SiteId = (Guid)HttpContext.Items["Piranha_SiteId"];

            //return View(model);

            var json = JsonConvert.SerializeObject(model, serializerSettings);
            return new OkObjectResult(json);
        }

        /// <summary>
        /// Gets the post with the specified id.
        /// </summary>
        /// <param name="id">The unique id</param>
        [HttpGet("post")]
        public IActionResult Post(Guid id)
        {
            var model = api.Posts.GetById<CoreWebViewModels.BlogPost>(id);           
            //ViewBag.CurrentPage = model.BlogId;
            //ViewBag.SiteId = (Guid)HttpContext.Items["Piranha_SiteId"];

            //return View(model);
            var json = JsonConvert.SerializeObject(model, serializerSettings);
            return new OkObjectResult(json);
        }

        /// <summary>
        /// Gets the page with the specified id.
        /// </summary>
        /// <param name="id">The unique id</param>
        /// <param name="startpage">If this is the site startpage</param>
        [HttpGet("teaserpage")]
        public IActionResult TeaserPage(Guid id, bool startpage)
        {
            var model = api.Pages.GetById<CoreWebViewModels.TeaserPage>(id);
            if (model.Heading.PrimaryImage.HasValue)
            {
                model.Heading.ImageUrl = Url.Content((string) model.Heading.PrimaryImage);
            }

            foreach (var teaser in model.Teasers)
            {
                if (teaser.Image.HasValue)
                {
                    teaser.ImageUrl = Url.Content(teaser.Image.Resize(api, 256));
                }
            }
            //ViewBag.CurrentPage = model.Id;
            //ViewBag.SiteId = (Guid)HttpContext.Items["Piranha_SiteId"];

            //if (startpage)
            //    return View("Start", model);
            //return View(model);

            var json = JsonConvert.SerializeObject(model, serializerSettings);
            return new OkObjectResult(json);
        }
    }
}
