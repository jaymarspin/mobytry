import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewTradeinPageRoutingModule } from './view-tradein-routing.module';

import { ViewTradeinPage } from './view-tradein.page';
import { TranslateModule } from '@ngx-translate/core';
import { VehicleDetailsMyComponent } from './components/vehicle-details-my/vehicle-details-my.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ReactiveFormsModule, TranslateModule, ViewTradeinPageRoutingModule],
  declarations: [ViewTradeinPage, VehicleDetailsMyComponent],
})
export class ViewTradeinPageModule {}
