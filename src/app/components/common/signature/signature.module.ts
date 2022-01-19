import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { SignatureComponent } from './signature.component';

@NgModule({
  imports: [CommonModule, IonicModule, TranslateModule],
  declarations: [SignatureComponent],
  exports: [SignatureComponent],
})
export class SignatureComponentModule {}
