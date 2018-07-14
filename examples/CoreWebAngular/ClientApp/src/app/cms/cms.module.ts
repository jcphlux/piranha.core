import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { ArchiveComponent } from './archive/archive.component';
import { CmsComponent } from './cms.component';
import { CmsService } from './cms.service';
import { PageComponent } from './page/page.component';
import { PostComponent } from './post/post.component';
import { BlockComponent } from './shared/block/block.component';
import { FirstParagraphPipe } from './shared/utils';
import { StartComponent } from './start/start.component';
import { TeaserPageComponent } from './teaser/teaser-page.component';
import { TeasersComponent } from './teaser/teasers.component';
import { RouterModule } from '@angular/router';
import { WildCardComponent } from './wildcard/wildcard.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot([
      {
        path: '', component: CmsComponent,
        children: [
          { path: '**', component: WildCardComponent }
        ]
      }
    ])
  ],
  entryComponents: [
    WildCardComponent,
    CmsComponent,
    ArchiveComponent,
    PageComponent,
    PostComponent,
    StartComponent,
    TeasersComponent,
    TeaserPageComponent
  ],
  declarations: [
    FirstParagraphPipe,
    WildCardComponent,
    CmsComponent,
    BlockComponent,
    ArchiveComponent,
    PageComponent,
    PostComponent,
    StartComponent,
    TeasersComponent,
    TeaserPageComponent
  ],
  exports: [
    RouterModule,
    FirstParagraphPipe,
    BlockComponent,
    WildCardComponent,
    CmsComponent,
    ArchiveComponent,
    PageComponent,
    PostComponent,
    StartComponent,
    TeasersComponent,
    TeaserPageComponent
  ],

})
export class CmsModule {
  static forRoot(apiUrl: string = "api/cms"): ModuleWithProviders {
    CmsService.url = apiUrl;
    return {
      ngModule: CmsModule,
      providers: [CmsService]
    };
  }
}
