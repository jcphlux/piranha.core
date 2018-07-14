import { Component } from '@angular/core';
import { CmsService } from '../cms.service';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'wildcard',
  templateUrl: './wildcard.component.html'
})
 // WildCardComponent to deal with sitemap not being loaded for deep liinking
export class WildCardComponent {

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  sitemap: any;
  model: any;
  isLoading: boolean = true;
  currentPage: string;
  currentPageChild: boolean;

  constructor(private cmsService: CmsService, private router: Router) {

  }

  ngOnInit(): void {
    this.cmsService.sitemapChanged
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((value) => {
          this.router.navigate([this.router.url])
        }); 
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
