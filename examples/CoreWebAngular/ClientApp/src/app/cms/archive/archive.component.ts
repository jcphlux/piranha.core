import { Component } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { CmsService } from '../cms.service';

@Component({
  selector: 'archive',
  templateUrl: './archive.component.html'
})

export class ArchiveComponent {

  model: any;
  constructor(private meta: Meta, private cmsService: CmsService) {

  }
}
