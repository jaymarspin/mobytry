import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditTestdrivePageRoutingModule } from './edit-testdrive-routing.module';

import { EditTestdrivePage } from './edit-testdrive.page';
import { TranslateModule } from '@ngx-translate/core';
import { ItemErrComponentModule } from 'src/app/components/common/item-err/item-err.module';
import { TdformSgComponent } from './components/tdform-sg/tdform-sg.component';
import { ModelSelectorComponent } from '../components/model-selector/model-selector.component';
import { KeyScannerComponent } from '../components/key-scanner/key-scanner.component';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule, IonicModule, EditTestdrivePageRoutingModule, ItemErrComponentModule],
  declarations: [EditTestdrivePage, TdformSgComponent, ModelSelectorComponent, KeyScannerComponent],
  entryComponents: [],
})
export class EditTestdrivePageModule {}
