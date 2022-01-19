import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TradeinsPageRoutingModule } from './tradeins-routing.module';

import { TradeinsPage } from './tradeins.page';
import { FilterTradeinComponent } from './components/filter-tradein/filter-tradein.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, TranslateModule, TradeinsPageRoutingModule],
  declarations: [TradeinsPage, FilterTradeinComponent],
})
export class TradeinsPageModule {}
