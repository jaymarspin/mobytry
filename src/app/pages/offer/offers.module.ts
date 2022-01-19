import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OffersPageRoutingModule } from './offers-routing.module';

import { OffersPage } from './offers.page';
import { TranslateModule } from '@ngx-translate/core';
import { CustomCurrencyPipe } from 'src/app/pipes/custom-currency.pipe';
import { FilterOfferComponent } from './components/filter-offer/filter-offer.component';

@NgModule({
  imports: [CommonModule, FormsModule, TranslateModule, IonicModule, OffersPageRoutingModule],
  declarations: [OffersPage, FilterOfferComponent],
})
export class OffersPageModule {}
