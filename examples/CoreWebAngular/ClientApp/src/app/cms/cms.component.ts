import { Component, OnDestroy, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { NavigationEnd, Router, NavigationStart } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
import { ArchiveComponent } from './archive/archive.component';
import { CmsService } from './cms.service';
import { PageComponent } from './page/page.component';
import { TeaserPageComponent } from './teaser/teaser-page.component';
import { StartComponent } from './start/start.component';
import { Route } from '@angular/compiler/src/core';

@Component({
  selector: 'cms',
  templateUrl: './cms.component.html'
})

export class CmsComponent implements OnDestroy, OnInit {

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  sitemap: any;
  model: any;
  isLoading: boolean = true;
  currentPage: string;
  currentPageChild: boolean;
  constructor(private cmsService: CmsService, private router: Router) {

  }

  ngOnInit(): void {
    this.cmsService.loadingChanged
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((value) => {
        this.isLoading = value;
      });

    this.cmsService.sitemapChanged
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((value) => {

        let routes = this.router.config
        let parent = routes.find(route => {
          return route.path === ""
        });

        let siteRoutes = [];
        for (let route of value) {
          let link = route.Permalink.substring(1);

          let component: any;
          if (route.PageTypeName === "Teaser Page") {
            if (link === "") {
              component = StartComponent;
            } else {
              component = TeaserPageComponent;
            }

          } else if (route.PageTypeName === "Blog Archive") {
            component = ArchiveComponent;
          } if (route.PageTypeName === "Standard page") {
            component = PageComponent;
          }
          if (component) {
            siteRoutes.push({ path: link, component: component })
          }
        }
        parent.children = siteRoutes;

        this.router.resetConfig(routes);

        this.sitemap = value;
      });

    this.cmsService.modelChanged
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((value) => {
        this.model = value[0];
        this.currentPage = value[1];
      });

  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
