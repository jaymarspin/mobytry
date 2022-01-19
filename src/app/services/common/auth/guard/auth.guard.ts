import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoginPageRoutingKeys } from 'src/app/pages/login/login-routing.keys';
import { TabRoutingKeys } from 'src/app/pages/tabs/tabs/tabs-routing.keys';
import { AuthenticationService } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthenticationService, private navCtrl: NavController) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.auth.subUser().pipe(
      map((usr) => {
        if (usr && usr.isLoggedIn) {
          if (state.url.indexOf(LoginPageRoutingKeys.BASE) > 0) {
            this.navCtrl.navigateForward(TabRoutingKeys.BASE);
            return false;
          }
          return true;
        } else {
          if (state.url.indexOf(LoginPageRoutingKeys.BASE) > 0) {
            return true;
          } else {
            this.auth.addRedirect(state.url);
            this.navCtrl.navigateForward(LoginPageRoutingKeys.BASE);
            return false;
          }
        }
      })
    );
  }
}
