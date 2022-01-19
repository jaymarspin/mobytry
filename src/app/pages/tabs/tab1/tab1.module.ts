import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Tab1PageRoutingModule } from './tab1-routing.module';

import { Tab1Page } from './tab1.page';
import { MenuIconsComponent } from './components/menu-icons/menu-icons.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, TranslateModule, Tab1PageRoutingModule],
  declarations: [Tab1Page, MenuIconsComponent],
})
export class Tab1PageModule {}
