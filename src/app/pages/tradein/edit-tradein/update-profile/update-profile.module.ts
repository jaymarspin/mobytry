import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpdateProfilePageRoutingModule } from './update-profile-routing.module';

import { UpdateProfilePage } from './update-profile.page';
import { TranslateModule } from '@ngx-translate/core';
import { ItemErrComponentModule } from 'src/app/components/common/item-err/item-err.module';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ReactiveFormsModule, TranslateModule, ItemErrComponentModule, UpdateProfilePageRoutingModule],
  declarations: [UpdateProfilePage],
})
export class UpdateProfilePageModule {}
