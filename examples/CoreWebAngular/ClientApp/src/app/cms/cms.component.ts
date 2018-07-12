import { Component } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { CmsService } from './cms.service';

@Component({
    selector: 'cms',
    templateUrl: './cms.component.html'
})

export class CmsComponent {

  model: any;

  isStartPage: boolean;
  constructor(private meta: Meta, private cmsService: CmsService) {

  }
}
