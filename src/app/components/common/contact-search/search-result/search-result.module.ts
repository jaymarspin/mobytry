import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { SearchResultComponent } from './search-result.component';

@NgModule({
  imports: [CommonModule, IonicModule, FormsModule, TranslateModule],
  declarations: [SearchResultComponent],
  exports: [SearchResultComponent],
})
export class SearchResultComponentModule {}
