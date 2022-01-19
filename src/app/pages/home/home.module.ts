import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { MenuIconsComponent } from './components/menu-icons/menu-icons.component';
import { HomePageRoutingModule } from './home-routing.module';
import { HomePage } from './home.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, TranslateModule, HomePageRoutingModule],
  declarations: [HomePage, MenuIconsComponent],
})
export class HomePageModule {}
