import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { ArchiveComponent } from './archive/archive.component';
import { CmsComponent } from './cms.component';
import { CmsService } from './cms.service';
import { PageComponent } from './page/page.component';
import { PostComponent } from './post/post.component';
import { HtmlBlockComponent } from './shared/html-block/html-block.component';
import { HtmlColumnBlockComponent } from './shared/html-column-block/html-column-block.component';
import { ImageBlockComponent } from './shared/image-block/image-block.component';
import { QuoteBlockComponent } from './shared/quote-block/quote-block.component';
import { FirstParagraphPipe } from './shared/utils';
import { StartComponent } from './start/start.component';
import { TeaserPageComponent } from './teaser/teaser-page.component';
import { TeasersComponent } from './teaser/teasers.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot([
      { path: '', component: CmsComponent, pathMatch: 'full' },
      { path: '**', component: CmsComponent }
    ])
  ],
  declarations: [
    FirstParagraphPipe,
    ArchiveComponent,
    PageComponent,
    PostComponent,
    HtmlBlockComponent,
    HtmlColumnBlockComponent,
    ImageBlockComponent,
    QuoteBlockComponent,
    StartComponent,
    TeaserPageComponent,
    TeasersComponent,
    CmsComponent
  ],
  exports: [
    RouterModule,
    CmsComponent
  ],

})
export class CmsModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CmsModule,
      providers: [CmsService]
    };
  }
}
