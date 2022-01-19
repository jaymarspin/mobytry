import { Component, Inject, OnInit } from '@angular/core';
import { from, of, Subscription } from 'rxjs';

import { flatMap, mergeMap, filter } from 'rxjs/operators';

import { AppVersion } from '@ionic-native/app-version/ngx';
import { Contacts } from '@ionic-native/contacts/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ModalController, NavController, Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { SplashScreenComponent } from './components/common/splash-screen/splash-screen.component';
import { UserInfo } from './models/common/user.model';
import { LanguageRoutingKeys } from './pages/language/language-routing.keys';
import { LoginPageRoutingKeys } from './pages/login/login-routing.keys';
import { NotificationsRoutingKeys } from './pages/notifications/notifications-routing.key';
import { ProfileRoutingKeys } from './pages/profile/profile-routing.keys';
import { AuthenticationService } from './services/common/auth/auth.service';
import { ErrorService } from './services/common/error/error.service';
import { NotificationService } from './services/common/notification/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  appVersionNumber = from(this.platform.ready()).pipe(
    mergeMap((_) => {
      return this.appVersion.getVersionNumber();
    })
  );
  user: UserInfo;
  notificationCount: number;
  private subs: Subscription = new Subscription();
  appEnv = environment.production ? 'PROD' : 'TEST';

  constructor(
    private appVersion: AppVersion,
    private platform: Platform,
    private statusBar: StatusBar,
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private authSrvc: AuthenticationService,
    private notifyService: NotificationService,
    private translate: TranslateService,
    private errService: ErrorService,
    private notification: NotificationService,
    private contacts: Contacts, 
  ) {
    this.initializeApp();
  }
 

  ngOnInit() {
  
    const sample: any = {}
    try{
      sample.speak()
    }catch(e){
 
      console.log(new Error(e).stack)
      alert(e) 
      this.errService.handleError(e)
    }

    try {
      const subUser = this.authSrvc.subUser().subscribe(
        async (user) => {
          this.user = user;
          if (this.user && this.user.name) {
            this.notification.init();
            this.checkContactPermission();
          }
        },
        (err) => this.errService.handleError(err)
      );
      this.subs.add(subUser);
    } catch (err) {
      this.errService.logError(err);
    }
  }

  initializeApp() {
    from(this.platform.ready())
      .pipe(
        mergeMap((_) => {
          this.statusBar.styleDefault();
          this.notifyService.onMessageReceived();
          this.translate.setDefaultLang('en');
          return this.createSplashModal();
        })
      )
      .subscribe(
        (_) => {},
        (err) => {
          console.error(err);
        }
      );
  }

  goToProfile() {
    this.navCtrl.navigateForward(ProfileRoutingKeys.BASE);
  }

  goToLanguage() {
    this.navCtrl.navigateForward(LanguageRoutingKeys.BASE);
  }

  goToNotifications() {
    this.navCtrl.navigateForward(NotificationsRoutingKeys.BASE);
  }

  logout() {
    this.authSrvc.signOut().add(() => {
      this.navCtrl.navigateForward(LoginPageRoutingKeys.BASE);
    });
  }

  private checkContactPermission() {
    // we call this on init to get cotnact permission on ios
    if (!this.platform.is('ios')) {
      return;
    }
    from(
      this.contacts.find(['name'], {
        filter: 'init',
        multiple: false,
      })
    ).subscribe(
      (_) => {},
      (err) => {
        this.errService.logError(err);
      }
    );
  }

  private createSplashModal() {
    return from(
      this.modalCtrl.create({
        component: SplashScreenComponent,
        backdropDismiss: false,
        animated: false,
        cssClass: 'full-screen',
      })
    ).pipe(
      mergeMap((res) => {
        res.present();
        return of(res);
      })
    );
  }
}
