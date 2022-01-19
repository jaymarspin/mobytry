import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewOfferPageRoutingModule } from './view-offer-routing.module';

import { ViewOfferPage } from './view-offer.page';
import { TranslateModule } from '@ngx-translate/core';
import { CustomCurrencyPipe } from 'src/app/pipes/custom-currency.pipe';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, TranslateModule, ViewOfferPageRoutingModule],
  declarations: [ViewOfferPage, CustomCurrencyPipe],
})
export class ViewOfferPageModule {}
