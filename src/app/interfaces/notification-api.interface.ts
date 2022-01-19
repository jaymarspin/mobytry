import { Observable } from 'rxjs';
import { DeviceToken } from '../models/common/device-token.model';
import { InfiniteScrollModel } from '../models/common/infinite-scroll.model';
import { NotificationMessageModel } from '../models/common/notification-message.model';

export interface INotificationAPI {
  getExistingTokens(): Observable<DeviceToken[]>;
  saveToken(token: DeviceToken): Observable<boolean>;
  retrieveUserNotifications(): Observable<InfiniteScrollModel<NotificationMessageModel[]>>;
}
