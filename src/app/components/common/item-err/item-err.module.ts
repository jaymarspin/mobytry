import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ItemErrComponent } from './item-err.component';

@NgModule({
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
  declarations: [ItemErrComponent],
  exports: [ItemErrComponent],
})
export class ItemErrComponentModule {}
