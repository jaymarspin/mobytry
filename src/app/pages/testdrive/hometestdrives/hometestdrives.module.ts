import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HometestdrivesPageRoutingModule } from './hometestdrives-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { HometestdrivesPage } from './hometestdrives.page';
import { FilterTestdriveComponent } from './filter-testdrive/filter-testdrive/filter-testdrive.component';
@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, TranslateModule, HometestdrivesPageRoutingModule],
  declarations: [HometestdrivesPage, FilterTestdriveComponent],
})
export class HometestdrivesPageModule {}
