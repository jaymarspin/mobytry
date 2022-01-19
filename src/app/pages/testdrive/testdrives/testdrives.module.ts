import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TestdrivesPageRoutingModule } from './testdrives-routing.module';

import { TestdrivesPage } from './testdrives.page';
import { TranslateModule } from '@ngx-translate/core';
import { FilterTestdriveComponent } from './filter-testdrive/filter-testdrive.component';

@NgModule({
  imports: [CommonModule, FormsModule, TranslateModule, IonicModule, TestdrivesPageRoutingModule],
  declarations: [TestdrivesPage, FilterTestdriveComponent],
})
export class TestdrivesPageModule {}
