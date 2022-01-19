import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditTaskPageRoutingModule } from './edit-task-routing.module';

import { EditTaskPage } from './edit-task.page';
import { TranslateModule } from '@ngx-translate/core';
import { ItemErrComponentModule } from 'src/app/components/common/item-err/item-err.module';
import { AutocompleteComponentModule } from 'src/app/components/common/autocomplete/autocomplete.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    TranslateModule,
    EditTaskPageRoutingModule,
    ItemErrComponentModule,
    AutocompleteComponentModule,
  ],
  declarations: [EditTaskPage],
})
export class EditTaskPageModule {}
