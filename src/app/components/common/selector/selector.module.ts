import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SelectorComponent } from './selector.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [CommonModule, IonicModule, TranslateModule],
  declarations: [SelectorComponent],
  exports: [SelectorComponent],
})
export class SelectorComponentModule {}
