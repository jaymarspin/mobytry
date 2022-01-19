import { Injectable } from '@angular/core';
import { INotificationAPI } from 'src/app/interfaces/notification-api.interface';
import { Observable } from 'rxjs';
import { DeviceToken } from 'src/app/models/common/device-token.model';
import { InfiniteScrollModel } from 'src/app/models/common/infinite-scroll.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationAPIMY implements INotificationAPI {
  constructor() {}
  getExistingTokens(): Observable<import('../../../models/common/device-token.model').DeviceToken[]> {
    throw new Error('Method not implemented.');
  }
  saveToken(token: DeviceToken): Observable<boolean> {
    throw new Error('Method not implemented.');
  }
  retrieveUserNotifications(): Observable<InfiniteScrollModel<import('../../../models/common/notification-message.model').NotificationMessageModel[]>> {
    throw new Error('Method not implemented.');
  }
}
