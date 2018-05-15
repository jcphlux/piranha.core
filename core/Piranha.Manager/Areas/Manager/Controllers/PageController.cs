﻿/*
 * Copyright (c) 2016-2017 Håkan Edling
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE file for details.
 * 
 * https://github.com/piranhacms/piranha.core
 * 
 */

using Piranha.Areas.Manager.Services;
using Piranha.Manager;
using Piranha.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Piranha.Areas.Manager.Controllers
{
    [Area("Manager")]
    public class PageController : ManagerAreaControllerBase
    {
        private const string COOKIE_SELECTEDSITE = "PiranhaManager_SelectedSite";
        private readonly PageEditService editService;
        private readonly IContentService<Data.Page, Data.PageField, Piranha.Models.PageBase> contentService;

        /// <summary>
        /// Default constructor.
        /// </summary>
        /// <param name="api">The current api</param>
        /// <param name="editService">The current page edit service</param>
        /// <param name="factory">The content service factory</param>
        public PageController(IApi api, PageEditService editService, IContentServiceFactory factory) : base(api) { 
            this.editService = editService;
            this.contentService = factory.CreatePageService();
        }

        /// <summary>
        /// Gets the list view for the pages.
        /// </summary>
        [Route("manager/pages/{pageId?}")]
        [Authorize(Policy = Permission.Pages)]
        public ViewResult List(string pageId = null) {
            // Get the currently selected site from the request cookies
            var siteId = Request.Cookies[COOKIE_SELECTEDSITE];
            Guid? site = null;

            if (!string.IsNullOrWhiteSpace(siteId))
                site = new Guid(siteId);

            return ListSite(site, pageId);
        }

        /// <summary>
        /// Gets the list view for the pages of the specified site.
        /// </summary>
        [Route("manager/pages/site/{siteId:Guid?}/{pageId?}")]
        [Authorize(Policy = Permission.Pages)]
        public ViewResult ListSite(Guid? siteId, string pageId = null) {
            var model = Models.PageListModel.Get(api, siteId, pageId);
            var defaultSite = api.Sites.GetDefault();

            // Store a cookie on our currently selected site
            if (siteId.HasValue)
                Response.Cookies.Append(COOKIE_SELECTEDSITE, siteId.ToString());
            else Response.Cookies.Delete(COOKIE_SELECTEDSITE); 

            return View("List", model);
        }

        /// <summary>
        /// Gets the edit view for a page.
        /// </summary>
        /// <param name="id">The page id</param>
        [Route("manager/page/{id:Guid}")]
        [Authorize(Policy = Permission.PagesEdit)]
        public IActionResult Edit(Guid id) {
            return View(editService.GetById(id));
        }

        /// <summary>
        /// Adds a new page of the given type.
        /// </summary>
        /// <param name="type">The page type id</param>
        /// <param name="siteId">The optional site id</param>
        [Route("manager/page/add/{type}/{siteId:Guid?}")]
        [Authorize(Policy = Permission.PagesAdd)]
        public IActionResult Add(string type, Guid? siteId = null) {
            var sitemap = api.Sites.GetSitemap(siteId, onlyPublished: false);
            var model = editService.Create(type, siteId);
            model.SortOrder = sitemap.Count;

            return View("Edit", model);
        }

        /// <summary>
        /// Adds a new page of the given type at the specified position.
        /// </summary>
        /// <param name="type">The page type id</param>
        /// <param name="sortOrder">The sort order</param>
        /// <param name="parentId">The parent id</param>
        /// <param name="siteId">The optional site id</param>
        [Route("manager/page/add/{type}/{sortOrder:int}/{parentId:Guid?}/{siteId:Guid?}")]
        public IActionResult AddAt(string type, int sortOrder, Guid? parentId = null, Guid? siteId = null) {
            var model = editService.Create(type, siteId);

            model.ParentId = parentId;
            model.SortOrder = sortOrder;

            return View("Edit", model);
        }

        /// <summary>
        /// Saves the given page model
        /// </summary>
        /// <param name="model">The page model</param>
        [HttpPost]
        [Route("manager/page/save")]
        [Authorize(Policy = Permission.PagesSave)]
        public IActionResult Save(Models.PageEditModel model) {
            // Validate
            if (string.IsNullOrWhiteSpace(model.Title)) {
                ErrorMessage("The page could not be saved. Title is mandatory", false);
                return View("Edit", editService.Refresh(model));                
            }

            var ret = editService.Save(model, out var alias);

            // Save
            if (ret) {
                if (!string.IsNullOrWhiteSpace(alias))
                    TempData["AliasSuggestion"] = alias;
                    
                SuccessMessage("The page has been saved.");
                return RedirectToAction("Edit", new { id = model.Id });
            } else {
                ErrorMessage("The page could not be saved.", false);
                return View("Edit", editService.Refresh(model));
            }
        }

        /// <summary>
        /// Saves and publishes the given page model.
        /// </summary>
        /// <param name="model">The page model</param>
        [HttpPost]
        [Route("manager/page/publish")]
        [Authorize(Policy = Permission.PagesPublish)]
        public IActionResult Publish(Models.PageEditModel model) {
            // Validate
            if (string.IsNullOrWhiteSpace(model.Title)) {
                ErrorMessage("The page could not be saved. Title is mandatory", false);
                return View("Edit", editService.Refresh(model));
            }

            // Save
            if (editService.Save(model, out var alias, true)) {
                SuccessMessage("The page has been published.");
                return RedirectToAction("Edit", new { id = model.Id });
            } else {
                ErrorMessage("The page could not be published.", false);
                return View(model);
            }
        }

        /// <summary>
        /// Saves and unpublishes the given page model.
        /// </summary>
        /// <param name="model">The page model</param>
        [HttpPost]
        [Route("manager/page/unpublish")]
        [Authorize(Policy = Permission.PagesPublish)]
        public IActionResult UnPublish(Models.PageEditModel model) {
            if (editService.Save(model, out var alias, false)) {
                SuccessMessage("The page has been unpublished.");
                return RedirectToAction("Edit", new { id = model.Id });
            } else {
                ErrorMessage("The page could not be unpublished.", false);
                return View(model);
            }
        }

        /// <summary>
        /// Moves a page to match the given structure.
        /// </summary>
        /// <param name="structure">The page structure</param>
        [HttpPost]
        [Route("manager/pages/move")]
        [Authorize(Policy = Permission.PagesEdit)]
        public IActionResult Move([FromBody]Models.PageStructureModel structure) {
            for (var n = 0; n < structure.Items.Count; n++) {
                var moved = MovePage(structure.Items[n], n);
                if (moved)
                    break;
            }
            using (var config = new Config(api)) {
                return View("Partial/_Sitemap", new Models.SitemapModel() {
                    Sitemap = api.Sites.GetSitemap(onlyPublished: false),
                    ExpandedLevels = config.ManagerExpandedSitemapLevels
                });
            }
        }

        /// <summary>
        /// Deletes the page with the given id.
        /// </summary>
        /// <param name="id">The unique id</param>
        [Route("manager/page/delete/{id:Guid}")]
        [Authorize(Policy = Permission.PagesDelete)]
        public IActionResult Delete(Guid id) {
            api.Pages.Delete(id);
            SuccessMessage("The page has been deleted");
            return RedirectToAction("List");
        }

        /// <summary>
        /// Adds a new region to a page.
        /// </summary>
        /// <param name="model">The model</param>
        [HttpPost]
        [Route("manager/page/region")]
        [Authorize(Policy = Permission.Pages)]
        public IActionResult AddRegion([FromBody]Models.PageRegionModel model) {
            var pageType = api.PageTypes.GetById(model.PageTypeId);

            if (pageType != null) {
                var regionType = pageType.Regions.SingleOrDefault(r => r.Id == model.RegionTypeId);

                if (regionType != null) {
                    var region = Piranha.Models.DynamicPage.CreateRegion(api,
                        model.PageTypeId, model.RegionTypeId);

                    var editModel = (Models.PageEditRegionCollection)editService.CreateRegion(regionType, 
                        new List<object>() { region});

                    ViewData.TemplateInfo.HtmlFieldPrefix = $"Regions[{model.RegionIndex}].FieldSets[{model.ItemIndex}]";
                    return View("EditorTemplates/PageEditRegionItem", editModel.FieldSets[0]);
                }
            }
            return new NotFoundResult();
        }

        /// <summary>
        /// Adds a new block to the page.
        /// </summary>
        /// <param name="model">The model</param>
        [HttpPost]
        [Route("manager/page/block")]
        [Authorize(Policy = Permission.Pages)]        
        public IActionResult AddBlock([FromBody]Models.ContentBlockModel model) {
            var block = (Extend.Block)contentService.CreateBlock(model.TypeName);

            if (block != null) {
                ViewData.TemplateInfo.HtmlFieldPrefix = $"Blocks[{model.BlockIndex}]";
                return View("EditorTemplates/ContentEditBlock", new Models.ContentEditBlock() {
                    Id = block.Id,
                    CLRType = block.GetType().FullName,
                    Value = block
                });
            }
            return new NotFoundResult();
        }

        [HttpPost]
        [Route("manager/page/alias")]
        [Authorize(Policy = Permission.PagesEdit)]
        public IActionResult AddAlias(Guid siteId, Guid pageId, string alias, string redirect) {
            // Create alias
            Piranha.Manager.Utils.CreateAlias(api, siteId, alias, redirect);

            // Check if there are posts for this page
            var posts = api.Posts.GetAll(pageId);
            foreach (var post in posts) {
                // Only create aliases for published posts
                if (post.Published.HasValue)
                    Piranha.Manager.Utils.CreateAlias(api, siteId, $"{alias}/{post.Slug}", $"{redirect}/{post.Slug}");
            }

            SuccessMessage("The alias list was updated.");
            return RedirectToAction("Edit", new { id = pageId });
        }

        /// <summary>
        /// Gets the page modal for the specified site.
        /// </summary>
        /// <param name="siteId">The site id</param>
        [Route("manager/page/modal/{siteId:Guid?}")]
        [Authorize(Policy = Permission.Pages)]
        public IActionResult Modal(Guid? siteId = null) {
            return View(Models.PageModalModel.GetBySiteId(api, siteId));
        }  
        
        private bool MovePage(Models.PageStructureModel.PageStructureItem page, int sortOrder = 1, Guid? parentId = null) {
            var model = api.Pages.GetById(new Guid(page.Id));

            if (model != null) {
                if (model.ParentId != parentId || model.SortOrder != sortOrder) {
                    // Move the page in the structure.
                    api.Pages.Move(model, parentId, sortOrder);

                    // We only move one page at a time so we're done
                    return true;
                }

                for (var n = 0; n < page.Children.Count; n++) {
                    var moved = MovePage(page.Children[n], n, new Guid(page.Id));

                    if (moved)
                        return true;
                }
            }
            return false;
        }
    }
}
