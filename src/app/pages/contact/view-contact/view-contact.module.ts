import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewContactPageRoutingModule } from './view-contact-routing.module';

import { ViewContactPage } from './view-contact.page';
import { TranslateModule } from '@ngx-translate/core';
import { DocumentSegmentComponent } from './components/common/document-segment/document-segment.component';
import { InfoSegmentComponent } from './components/common/info-segment/info-segment.component';
import { OpportunitySegmentComponent } from './components/common/opportunity-segment/opportunity-segment.component';
import { DocUploadModalComponentModule } from 'src/app/components/common/doc-upload-modal/doc-upload-modal.module';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, TranslateModule, ViewContactPageRoutingModule, DocUploadModalComponentModule],
  declarations: [ViewContactPage, DocumentSegmentComponent, InfoSegmentComponent, OpportunitySegmentComponent],
})
export class ViewContactPageModule {}
