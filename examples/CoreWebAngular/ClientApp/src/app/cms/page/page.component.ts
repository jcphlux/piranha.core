import { Component, OnInit, OnDestroy } from '@angular/core';
import { CmsService } from '../cms.service';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'page',
    templateUrl: './page.component.html'
})

export class PageComponent {

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  model: any;
  third: any;
  isLoading: boolean = true;
  constructor(private cmsService: CmsService) {

  }

  ngOnInit(): void {

    this.cmsService.loadingChanged
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((value) => {
        this.isLoading = value;
      });

    this.cmsService.modelChanged
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((value) => {
        this.model = value[0];
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
