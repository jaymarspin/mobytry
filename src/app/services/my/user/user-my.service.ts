import { Injectable } from '@angular/core';
import { User, UserInfo } from 'src/app/models/common/user.model';
import { Observable, of, throwError } from 'rxjs';
import { IUserAPI } from 'src/app/interfaces/user-api.interface';
import { Query } from 'src/app/models/sg/query.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ErrorService } from '../../common/error/error.service';
import { map, catchError } from 'rxjs/operators';
import { APPROVE_PA_PERM } from '../../common/auth/permission.keys';

@Injectable({
  providedIn: 'root',
})
export class UserAPIMY implements IUserAPI {
  readonly EXPIRY: number = 25 * 60 * 1000; // refresh every 25 minutes
  readonly APPROVE_PA_ROLE = new Set<string>(['Salesforce Administrator', 'PPSL: Purchasing Manager']);
  constructor(private http: HttpClient, private errorService: ErrorService) {}

  public retrieveUser(user: User): Observable<User> {
    if (!user.accessToken || !user.instanceUrl || !user.userId) {
      throw new Error('Missing Information for user access call.');
    }
    const opt = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.accessToken}`,
      }),
    };
    const query = `SELECT Id, Name, UserRole.Name FROM User WHERE Id = '${user.userId}'`;
    const urlFriendly = encodeURI(query);
    return this.http.get<Query>(`${user.instanceUrl}/services/data/v48.0/query/?q=${urlFriendly}`, opt).pipe(
      map((res) => {
        if (res && res.records && res.records.length > 0) {
          user.name = res.records[0].Name;
          user.userId = res.records[0].Id;
          user.permissions = user.permissions ? user.permissions : [];
          if (res.records[0].UserRole && res.records[0].UserRole.Name && this.APPROVE_PA_ROLE.has(res.records[0].UserRole.Name)) {
            user.permissions.push(APPROVE_PA_PERM);
          }
        }
        return user;
      }),
      catchError((e) => {
        this.errorService.logError(e);
        return throwError(e);
      })
    );
  }

  public mapLoginInfo(loginInfo, usr: User): User {
    if (!loginInfo.access_token) {
      throw new Error(`Invalid Access Token: ${loginInfo.access_token}`);
    }
    usr.accessToken = loginInfo.access_token;
    usr.instanceUrl = loginInfo.instance_url;
    usr.idToken = loginInfo.id_token;
    usr.userUrl = loginInfo.id;
    usr.refreshToken = loginInfo.refresh_token;
    const userIdIndex: number = usr.userUrl.lastIndexOf('/');
    usr.userId = usr.userUrl.substring(userIdIndex + 1);
    const issueDate: number = parseInt(loginInfo.issued_at, 10);
    usr.accessExpiry = new Date(issueDate + this.EXPIRY);
    return usr;
  }

  public getUserInfo(id: string): Observable<UserInfo> {
    const usr = new UserInfo();
    usr.name = 'Dominique Kevin Macasero';
    usr.companyName = 'BMW Auto Bavaria Ara Damansara';
    usr.teamName = 'Team A';
    usr.userPhoto = 'https://pbs.twimg.com/profile_images/1210618202457292802/lt9KD2lt.jpg';
    return of(usr);
  }
}
