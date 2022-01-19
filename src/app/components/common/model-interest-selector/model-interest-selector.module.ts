import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ModelInterestSelectorComponent } from './model-interest-selector.component';

@NgModule({
  imports: [CommonModule, IonicModule, FormsModule],
  declarations: [ModelInterestSelectorComponent],
  exports: [ModelInterestSelectorComponent],
})
export class ModelInterestSelectorModule {}
