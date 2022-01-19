import { Injectable, Inject, NgZone } from '@angular/core';
import { ErrorService } from '../error/error.service';
import { Platform, NavController } from '@ionic/angular';
import { NOTIFY_API_KEY } from 'src/app/service-providers/dynamic-key.provider';
import { INotificationAPI } from 'src/app/interfaces/notification-api.interface';
import { User } from 'src/app/models/common/user.model';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { InfiniteScrollModel } from 'src/app/models/common/infinite-scroll.model';
import { NotificationMessageModel } from 'src/app/models/common/notification-message.model';
import { AuthenticationService } from '../auth/auth.service';
import { tap, flatMap, mergeMap } from 'rxjs/operators';
import { DeviceToken } from 'src/app/models/common/device-token.model';
import {
  PushNotificationSchema,
  PushNotifications,
  PushNotificationToken,
  PushNotificationActionPerformed,
  Token,
  ActionPerformed,
} from '@capacitor/push-notifications';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private user: User;
  private notificationList: BehaviorSubject<InfiniteScrollModel<NotificationMessageModel[]>> = new BehaviorSubject(new InfiniteScrollModel([], null));

  constructor(
    private errService: ErrorService,
    private platform: Platform,
    @Inject(NOTIFY_API_KEY) private notifyAPI: INotificationAPI,
    private navCtrl: NavController,
    private zone: NgZone,
    private authService: AuthenticationService
  ) {
    this.authService.subUser().subscribe((u) => {
      this.user = u;
    });
  }

  public subNotificationList() {
    return this.notificationList.asObservable();
  }

  public retrieveUserNotifications(): Observable<InfiniteScrollModel<NotificationMessageModel[]>> {
    return this.notifyAPI.retrieveUserNotifications().pipe(
      tap((newModel) => {
        // console.log(newModel)
        this.notificationList.next(newModel);
      })
    );
  }

  public init(): void {
    from(this.platform.ready()).subscribe((_) => {
      this.checkIfNeedRegistration();
      this.onTokenRefresh();
    });
  }

  public onMessageReceived() {
    from(
      PushNotifications.addListener('pushNotificationActionPerformed', (notification: ActionPerformed) => {
        if (this.user.isLoggedIn) {
          // this.zone.run(() => this.navCtrl.navigateForward(NotificationListPageKeys.BASE));
        } else {
          // this.authService.addRedirect(`/${NotificationListPageKeys.BASE}`);
        }
      })
    ).subscribe(
      () => {},
      (err) => {
        this.errService.logError(err);
      }
    );
  }

  private saveDeviceToken(token: string): void {
    if (!token) {
      return;
    }
    this.notifyAPI
      .getExistingTokens()
      .pipe(
        mergeMap((res) => {
          let curToken: DeviceToken = new DeviceToken();
          curToken.Token = token;
          res.forEach((t) => {
            if (t && t.Token === token) {
              curToken = t;
            }
          });
          return this.notifyAPI.saveToken(curToken);
        })
      )
      .subscribe(
        () => {
          console.log(`token saved!`);
        },
        (err) => {
          this.errService.logError(err);
        }
      );
  }

  private checkIfNeedRegistration(): void {
    from(PushNotifications.checkPermissions())
      .pipe(
        mergeMap((res) => {
          let obs = of(true);
          if (res.receive !== 'granted') {
            from(PushNotifications.requestPermissions()).subscribe((e) => {
              if (e.receive === 'granted') {
                obs = of(true);
              } else {
                obs = of(false);
              }
            });
            return obs;
          }
          return obs;
        }),
        mergeMap((permissionRes) => {
          if (permissionRes) {
            return PushNotifications.addListener('registration', (token: Token) => {
              return of(token.value);
            });
          } else {
            return of(null);
          }
        })
      )
      .subscribe(
        () => {}, // handled by tokenRefresh
        (err) => {
          this.errService.logError(err);
        }
      );
  }

  private onTokenRefresh() {
    from(
      PushNotifications.addListener('registration', (token: Token) => {
        this.saveDeviceToken(token.value);
      })
    ).subscribe(
      () => {},
      (err) => {
        this.errService.logError(err);
      }
    );
  }
}
