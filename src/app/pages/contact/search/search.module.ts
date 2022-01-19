import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchPageRoutingModule } from './search-routing.module';

import { SearchPage } from './search.page';
import { TranslateModule } from '@ngx-translate/core';
import { SearchResultComponentModule } from 'src/app/components/common/contact-search/search-result/search-result.module';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, TranslateModule, SearchResultComponentModule, SearchPageRoutingModule],
  declarations: [SearchPage],
})
export class SearchPageModule {}
