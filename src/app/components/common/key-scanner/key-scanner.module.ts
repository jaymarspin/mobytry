import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { KeyScannerComponent } from './key-scanner.component';

@NgModule({
  imports: [CommonModule, IonicModule],
  declarations: [KeyScannerComponent],
  exports: [KeyScannerComponent],
})
export class KeyScannerComponentModule {}
