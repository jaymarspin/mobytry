import { Component, OnInit } from '@angular/core';
import { combineLatest, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { UserInfo } from 'src/app/models/common/user.model';
import { AuthenticationService } from 'src/app/services/common/auth/auth.service';
import { ErrorService } from 'src/app/services/common/error/error.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  user: UserInfo;
  authState$ = this.authService.subAuthState();
  private subs: Subscription = new Subscription();

  constructor(private authService: AuthenticationService, private errService: ErrorService) {}

  ngOnInit() {
    try {
      const subUser = this.authService.subUser().subscribe(
        async (user) => {
          this.user = user;
        },
        (err) => this.errService.handleError(err)
      );
      this.subs.add(subUser);
    } catch (err) {
      this.errService.logError(err);
    }
  }
  ngAfterContentInit() {
    const subShowAuth = combineLatest([this.authService.subUser()])
      .pipe(
        first(([usr]) => {
          return usr != null && !usr.isLoggedIn;
        })
      )
      .subscribe(
        () => {},
        (err) => this.errService.logError(err)
      );
    this.subs.add(subShowAuth);
  }
}
