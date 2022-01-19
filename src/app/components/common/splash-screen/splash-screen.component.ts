import { Component, OnInit, AfterContentInit } from '@angular/core';
import { ErrorService } from 'src/app/services/common/error/error.service';
import { ModalController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/common/auth/auth.service';
import { SplashScreen } from '@capacitor/splash-screen';

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.scss'],
})
export class SplashScreenComponent implements AfterContentInit {
  constructor(private errorService: ErrorService, private modal: ModalController, private authService: AuthenticationService) {}
  ngAfterContentInit() {
    try {
      setTimeout(() => {
        // NOTE: need timeout to ensure this runs after everything is setup
        SplashScreen.hide();
        this.authService.hasSavedToken().subscribe(() => {
          setTimeout(() => {
            this.modal.dismiss();
          }, 800);
        });
      }, 400);
    } catch (err) {
      this.errorService.logError(err);
    }
  }
}
