import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ContactSearchComponent } from './contact-search.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchResultComponentModule } from './search-result/search-result.module';
import { ItemErrComponentModule } from '../item-err/item-err.module';

@NgModule({
  imports: [CommonModule, IonicModule, TranslateModule, FormsModule, ReactiveFormsModule, SearchResultComponentModule, ItemErrComponentModule],
  declarations: [ContactSearchComponent],
  exports: [ContactSearchComponent],
  entryComponents: [ContactSearchComponent],
})
export class ContactSearchComponentModule {}
