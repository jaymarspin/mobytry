import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ItemErrComponentModule } from '../item-err/item-err.module';
import { DocUploadModalComponent } from './doc-upload-modal.component';

@NgModule({
  imports: [CommonModule, IonicModule, TranslateModule, FormsModule, ReactiveFormsModule, ItemErrComponentModule],
  declarations: [DocUploadModalComponent],
  exports: [DocUploadModalComponent],
  entryComponents: [DocUploadModalComponent],
})
export class DocUploadModalComponentModule {}
