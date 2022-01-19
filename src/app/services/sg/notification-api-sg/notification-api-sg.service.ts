import { Injectable } from '@angular/core';
import { INotificationAPI } from 'src/app/interfaces/notification-api.interface';
import { User } from 'src/app/models/common/user.model';
import { AuthenticationService } from '../../common/auth/auth.service';
import { ApiService } from '../../common/api/api.service';
import { ApiSG } from '../api/api-sg.service';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { Device } from '@ionic-native/device/ngx';
import { Observable, from } from 'rxjs';
import { DeviceToken } from 'src/app/models/common/device-token.model';
import { map, mergeMap } from 'rxjs/operators';
import { InfiniteScrollModel } from 'src/app/models/common/infinite-scroll.model';
import { NotificationMessageModel } from 'src/app/models/common/notification-message.model';
import { DBResult } from 'src/app/models/sg/dbresult.model';
import { Query } from 'src/app/models/sg/query.model';
import { parseSFDate } from 'src/app/util/sf.date.util';

@Injectable({
  providedIn: 'root',
})
export class NotificationAPISG implements INotificationAPI {
  private user: User;
  constructor(
    private auth: AuthenticationService,
    private appVersion: AppVersion,
    private apiService: ApiService,
    private apiSettings: ApiSG,
    private device: Device
  ) {
    this.auth.subUser().subscribe((u) => {
      this.user = u;
    });
  }
  getExistingTokens(): Observable<DeviceToken[]> {
    return from(this.appVersion.getPackageName()).pipe(
      mergeMap((packageName) => {
        const query =
          `SELECT ${this.deviceTokenFields()} FROM User_Message_Token__c WHERE User__c = '${this.user.userId}' AND IsActive__c = TRUE AND ` +
          `App_ID__c = '${packageName}'`;
        return this.apiService.get<Query>(this.apiSettings.getQueryUrl(query));
      }),
      map((queryRes) => {
        if (!queryRes || !queryRes.records || queryRes.records.length <= 0) {
          return [];
        }
        return queryRes.records.map((token) => this.tokenFromSF(token));
      })
    );
  }

  saveToken(token: DeviceToken): Observable<boolean> {
    return from(this.appVersion.getPackageName()).pipe(
      mergeMap((packageName) => {
        let tokenReq: any = {};
        if (!token.Id) {
          tokenReq = {
            Device_Name__c: `${this.device.model}-${this.device.uuid}`,
            User__c: this.user.userId,
            Name: `${this.user.name}-${packageName}`,
            App_ID__c: packageName,
          };
        }
        tokenReq.IsActive__c = true;
        tokenReq.Token__c = token.Token;
        tokenReq.Last_Active_DateTime__c = new Date();
        if (token.Id) {
          return this.apiService.patch<DBResult>(this.apiSettings.getUpdateUrl('User_Message_Token__c', token.Id), tokenReq);
        } else {
          return this.apiService.post<DBResult>(this.apiSettings.getInsertUrl('User_Message_Token__c'), tokenReq);
        }
      }),
      map((res) => {
        return !!res && !!res.id;
      })
    );
  }

  retrieveUserNotifications(): Observable<InfiniteScrollModel<NotificationMessageModel[]>> {
    return from(this.appVersion.getPackageName()).pipe(
      mergeMap((packageName) => {
        const query =
          `SELECT ${this.notificationFields()} FROM Notification__c WHERE User__c = '${this.user.userId}' AND ` +
          `App_ID__c = '${packageName}' ORDER BY CreatedDate DESC`;
        return this.apiService.get<Query>(this.apiSettings.getQueryUrl(query)).pipe(
          map((notificationRes) => {
            return this.recursiveNotificationInfiniteScroll(notificationRes);
          })
        );
      })
    );
  }

  recursiveNotificationInfiniteScroll(res: Query): InfiniteScrollModel<NotificationMessageModel[]> {
    if (!res || !res.records || res.records.length <= 0) {
      return new InfiniteScrollModel([], null);
    }
    const notificationList = res.records.map((n) => this.notificationFromSF(n));
    let next: Observable<InfiniteScrollModel<NotificationMessageModel[]>> = null;
    if (res.nextRecordsUrl) {
      next = this.apiService.get<Query>(this.apiSettings.getNextRecordsUrl(res.nextRecordsUrl)).pipe(
        map((msgRes) => {
          return this.recursiveNotificationInfiniteScroll(msgRes);
        })
      );
    }
    return new InfiniteScrollModel(notificationList, next, res.totalSize);
  }

  private tokenFromSF(res: any): DeviceToken {
    const devToken = new DeviceToken();
    devToken.Id = res.Id;
    devToken.Token = res.Token__c;
    return devToken;
  }

  private notificationFromSF(res: any): NotificationMessageModel {
    const notification = new NotificationMessageModel();
    notification.Id = res.Id;
    notification.Message = res.Message__c;
    notification.CreatedDate = res.CreatedDate != null ? parseSFDate(res.CreatedDate) : null;
    notification.Header = res.Name;
    notification.Subtitle = res.Subtitle__c;
    if (res.Data__c) {
      notification.Data = JSON.parse(res.Data__c);
    }
    return notification;
  }

  private deviceTokenFields(prefix = ''): string {
    return `${prefix}Id, ${prefix}Token__c, ${prefix}User__c`;
  }

  private notificationFields(prefix = ''): string {
    return `${prefix}Id, ${prefix}Message__c, ${prefix}CreatedDate, ${prefix}Data__c, ${prefix}Name, ${prefix}Subtitle__c`;
  }
}
