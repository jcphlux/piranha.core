import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
import { CmsService } from '../cms.service';

@Component({
    selector: 'page',
    templateUrl: './page.component.html'
})

export class PageComponent implements OnDestroy{

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  model: any;
  third: any;
  isLoading: boolean = true;
  isRedirect: boolean = true;
  constructor(private cmsService: CmsService) {

    this.cmsService.loadingChanged
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((value) => {
        this.isLoading = value;
      });

    this.cmsService.modelChanged
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((value) => {       
        this.model = value[0];
        if (this.model.RedirectUrl && this.model.RedirectUrl !== "") {
          document.location.replace(this.model.RedirectUrl);
        } else {
          this.isRedirect = false;
        }
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
