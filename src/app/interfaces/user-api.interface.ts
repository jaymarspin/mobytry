import { Observable } from 'rxjs';
import { User, UserInfo } from '../models/common/user.model';

export interface IUserAPI {
  retrieveUser(user: User): Observable<User>;
  mapLoginInfo(loginInfo, usr): User;
  getUserInfo(id: string): Observable<UserInfo>;
}
