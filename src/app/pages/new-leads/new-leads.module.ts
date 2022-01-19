import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewLeadsPageRoutingModule } from './new-leads-routing.module';

import { NewLeadsPage } from './new-leads.page';
import { TranslateModule } from '@ngx-translate/core';
import { ContactSearchComponentModule } from 'src/app/components/common/contact-search/contact-search.module';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ReactiveFormsModule, TranslateModule, ContactSearchComponentModule, NewLeadsPageRoutingModule],
  declarations: [NewLeadsPage],
})
export class NewLeadsPageModule {}
