import { Injectable, Inject } from '@angular/core';
import { IUserAPI } from 'src/app/interfaces/user-api.interface';
import { User, UserInfo } from 'src/app/models/common/user.model';
import { Observable } from 'rxjs';
import { AUTH_PARAM_KEY } from 'src/app/service-providers/auth-param.provider';
import { USER_SERVICE_KEY } from 'src/app/service-providers/dynamic-key.provider';

@Injectable({
  providedIn: 'root',
})
export class CommonUserService {
  constructor(@Inject(USER_SERVICE_KEY) private user: IUserAPI) {}

  retrieveUser(user: User): Observable<User> {
    return this.user.retrieveUser(user);
  }
  mapLoginInfo(loginInfo: any, usr: any): User {
    return this.user.mapLoginInfo(loginInfo, usr);
  }

  getUserInfo(id: string): Observable<UserInfo> {
    return this.user.getUserInfo(id);
  }
}
