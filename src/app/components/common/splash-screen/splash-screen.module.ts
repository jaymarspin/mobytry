import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SplashScreenComponent } from './splash-screen.component';

@NgModule({
  imports: [CommonModule, IonicModule],
  declarations: [SplashScreenComponent],
  exports: [SplashScreenComponent],
  entryComponents: [SplashScreenComponent],
})
export class SplashScreenComponentModule {}
