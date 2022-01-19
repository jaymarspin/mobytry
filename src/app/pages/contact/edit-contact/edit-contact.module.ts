import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditContactPageRoutingModule } from './edit-contact-routing.module';

import { EditContactPage } from './edit-contact.page';
import { TranslateModule } from '@ngx-translate/core';
import { ItemErrComponentModule } from 'src/app/components/common/item-err/item-err.module';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ReactiveFormsModule, TranslateModule, ItemErrComponentModule, EditContactPageRoutingModule],
  declarations: [EditContactPage],
})
export class EditContactPageModule {}
