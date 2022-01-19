import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AutocompleteComponent } from './autocomplete.component';

@NgModule({
  imports: [CommonModule, IonicModule, FormsModule],
  declarations: [AutocompleteComponent],
  exports: [AutocompleteComponent],
})
export class AutocompleteComponentModule {}
