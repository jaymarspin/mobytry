import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TradeinProfilePageRoutingModule } from './tradein-profile-routing.module';

import { TradeinProfilePage } from './tradein-profile.page';
import { TranslateModule } from '@ngx-translate/core';
import { ItemErrComponentModule } from 'src/app/components/common/item-err/item-err.module';
import { TradeinFormMyComponent } from './components/tradein-form-my/tradein-form-my.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ReactiveFormsModule, TranslateModule, ItemErrComponentModule, TradeinProfilePageRoutingModule],
  declarations: [TradeinProfilePage, TradeinFormMyComponent],
})
export class TradeinProfilePageModule {}
