import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
import { CmsService } from '../cms.service';

@Component({
  selector: 'archive',
  templateUrl: './archive.component.html'
})

export class ArchiveComponent implements OnDestroy{

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  model: any;
  isLoading: boolean = true;
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
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
