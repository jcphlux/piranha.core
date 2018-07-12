import { Component } from '@angular/core';
import { CmsService } from '../cms.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'teasers',
  templateUrl: './teasers.component.html'
})

export class TeasersComponent {

  teaserWidth: number;
  model: any;
  constructor(private cmsService: CmsService) {

  }

  imgUrl(id: string): Observable<string> {
    return this.cmsService.getImgUrl(id, 256);
  }

}
