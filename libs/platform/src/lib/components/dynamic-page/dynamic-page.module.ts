import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DynamicPageComponent } from './dynamic-page.component';
import { DynamicPageContentComponent } from './dynamic-page-content/dynamic-page-content.component';
import { DynamicPageTitleComponent } from './dynamic-page-header/title/dynamic-page-title.component';
import { DynamicPageSubtitleComponent } from './dynamic-page-header/subtitle/dynamic-page-subtitle.component';
import { DynamicPageKeyInfoComponent } from './dynamic-page-header/key-info/dynamic-page-key-info.component';
import { DynamicPageGlobalActionsComponent } from './dynamic-page-header/actions/global-actions/dynamic-page-global-actions.component';
import { DynamicPageLayoutActionsComponent } from './dynamic-page-header/actions/layout-actions/dynamic-page-layout-actions.component';
import { DynamicPageHeaderComponent } from './dynamic-page-header/header/dynamic-page-header.component';
import { DynamicPageFooterComponent } from './dynamic-page-footer/dynamic-page-footer.component';
import { TabsModule } from '@fundamental-ngx/core';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { DynamicPageTabbedContentComponent } from './dynamic-page-content/dynamic-page-tabbed-content.component';
import { PlatformButtonModule } from '../button/public_api';

@NgModule({
    declarations: [
        DynamicPageComponent,
        DynamicPageTitleComponent,
        DynamicPageSubtitleComponent,
        DynamicPageKeyInfoComponent,
        DynamicPageGlobalActionsComponent,
        DynamicPageLayoutActionsComponent,
        DynamicPageHeaderComponent,
        DynamicPageContentComponent,
        DynamicPageTabbedContentComponent,
        DynamicPageFooterComponent
    ],
    imports: [CommonModule, TabsModule, ScrollingModule, PlatformButtonModule],
    exports: [
        DynamicPageComponent,
        DynamicPageTitleComponent,
        DynamicPageSubtitleComponent,
        DynamicPageKeyInfoComponent,
        DynamicPageGlobalActionsComponent,
        DynamicPageLayoutActionsComponent,
        DynamicPageHeaderComponent,
        DynamicPageContentComponent,
        DynamicPageTabbedContentComponent,
        DynamicPageFooterComponent
    ]
})
export class PlatformDynamicPageModule {}
