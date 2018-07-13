import { Component, Input } from '@angular/core';
import { CmsService } from '../cms.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'teasers',
  templateUrl: './teasers.component.html'
})

export class TeasersComponent {

  private _model: any;

  @Input()
  set model(val: any) {
    this._model = val;
    this.hasTeasers = val.length > 0;
    this.teaserWidth = this.hasTeasers ? 12 / val.length : 0;
  };

  teaserWidth: number;
  hasTeasers: boolean;

  get model(): any {
    return this._model;
  }

  constructor() { }
}
