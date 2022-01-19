import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditEventPageRoutingModule } from './edit-event-routing.module';

import { EditEventPage } from './edit-event.page';
import { AutocompleteComponentModule } from 'src/app/components/common/autocomplete/autocomplete.module';
import { TranslateModule } from '@ngx-translate/core';
import { ItemErrComponentModule } from 'src/app/components/common/item-err/item-err.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    TranslateModule,
    ItemErrComponentModule,
    AutocompleteComponentModule,
    EditEventPageRoutingModule,
  ],
  declarations: [EditEventPage],
})
export class EditEventPageModule {}
