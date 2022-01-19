import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { ContactListPageRoutingModule } from './contact-list-routing.module';
import { ContactListPage } from './contact-list.page';

@NgModule({
  imports: [CommonModule, FormsModule, TranslateModule, IonicModule, ContactListPageRoutingModule],
  declarations: [ContactListPage],
})
export class ContactListPageModule {}
