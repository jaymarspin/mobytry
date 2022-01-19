import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditOfferPageRoutingModule } from './edit-offer-routing.module';

import { EditOfferPage } from './edit-offer.page';
import { TranslateModule } from '@ngx-translate/core';
import { ItemErrComponentModule } from 'src/app/components/common/item-err/item-err.module';
import { SelectorComponentModule } from 'src/app/components/common/selector/selector.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    IonicModule,
    ItemErrComponentModule,
    SelectorComponentModule,
    EditOfferPageRoutingModule,
  ],
  declarations: [EditOfferPage],
})
export class EditOfferPageModule {}
