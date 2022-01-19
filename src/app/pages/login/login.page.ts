import {
  AfterContentInit, Component, NgZone, OnDestroy, OnInit
} from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { combineLatest, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { DeviceToken } from 'src/app/models/common/device-token.model';
import { AuthenticationService } from 'src/app/services/common/auth/auth.service';
import { ErrorService } from 'src/app/services/common/error/error.service';
import { LoginPageRoutingKeys } from './login-routing.keys';
import { VaultService } from '../../services/common/vault/vault.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy, AfterContentInit {
  user$ = this.authService.subUser();
  authState$ = this.authService.subAuthState();
  user: DeviceToken;

  private subs: Subscription = new Subscription();

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private navCtrl: NavController,
    private errService: ErrorService,
    private zone: NgZone,
    private VaultSrvc: VaultService
  ) { }

  ngOnInit() {
    

    this.user = new DeviceToken()
    try {
      const subUser = this.authService.subUser().subscribe(
        async (user) => {
          if (!this.router.isActive(LoginPageRoutingKeys.BASE, true)) {
            return;
          }

          if (user.isLoggedIn) {
            const tmp = new Date()
            const session = tmp.getTime()
            this.VaultSrvc.setSession(session.toString()).then(() => {
              this.navCtrl.navigateForward(this.authService.redirectIfAny())
            }).catch(() => {
              this.authService.normalizer()
            })
          }
        },
        (err) => this.errService.handleError(err)
      );
      this.subs.add(subUser);
    } catch (err) {
      this.errService.logError(err);
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  ngAfterContentInit() {
    const subShowAuth = combineLatest([this.authService.subUser(), this.authService.subAuthState()])
      .pipe(
        first(([usr, authState]) => {
          return usr != null && !usr.isLoggedIn && authState.hasSavedToken && !authState.loadedOAuth;
        })
      )
      .subscribe(
        () => { },
        (err) => {
          console.log('error here')
          this.errService.logError(err)
        }
      );
    this.subs.add(subShowAuth);
  }

  login() {
    try {
      this.authService.signIn().subscribe(
        async (user) => {
          console.log(user)

          // if(user.hasSavedToken === false){
          //     await  PushNotifications.requestPermissions().then(result => {
          //       if (result.receive === 'granted') {
          //         PushNotifications.register();
          //       } else {
          //         // Show some error
          //       }
          //     });
          // await  PushNotifications.addListener('registration', (token: Token) => {
          //       this.user.Token = token.value
          //     });
          // }
        },
        (err) => {
          console.error('err at login page', err);
          this.errService.presentServerErr(err);
          this.errService.logError(err);
        }
      );
    } catch (err) {
      this.errService.presentServerErr(err);
      this.errService.logError(err);
    }
  }

  authBiometric() {
    try {
      this.authService.biometricLogin().subscribe(
        user => {
          // console.log(user)
        },
        (err) => {
          console.log(err)
          // this.errService.presentServerErr(err);
          this.errService.logError(err);
        }
      );
    } catch (err) {
      console.log(err)
      this.errService.logError(err);
    }
  }
}
