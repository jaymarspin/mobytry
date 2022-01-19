import { Inject, Injectable } from '@angular/core';
import { IonicAuth, IonicAuthOptions } from '@ionic-enterprise/auth';
import { BehaviorSubject, combineLatest, from, Observable, of, throwError } from 'rxjs';
import { catchError, map, mergeMap, take, tap, timeout } from 'rxjs/operators';
import { IUserAPI } from 'src/app/interfaces/user-api.interface';
import { AuthState } from 'src/app/models/common/auth-state.model';
import { User } from 'src/app/models/common/user.model';
import { TabRoutingKeys } from 'src/app/pages/tabs/tabs/tabs-routing.keys';
import { AUTH_PARAM_KEY } from 'src/app/service-providers/auth-param.provider';
import { USER_SERVICE_KEY } from 'src/app/service-providers/dynamic-key.provider';
import { ErrorService } from '../error/error.service';
import { VaultService } from '../vault/vault.service';
import { Platform } from '@ionic/angular';


@Injectable({
  providedIn: 'root',
})
export class AuthenticationService extends IonicAuth {
  private redirectUrl = [];
  private curUser: BehaviorSubject<User> = new BehaviorSubject(new User());
  private curAuthState: BehaviorSubject<AuthState> = new BehaviorSubject(
    new AuthState()
  );
 

  // @ts-ignore
  constructor(
    private errService: ErrorService,
    public vaultSrvc: VaultService,
    platform: Platform,
    @Inject(USER_SERVICE_KEY) private userApi: IUserAPI,
    @Inject(AUTH_PARAM_KEY) private authParam: IonicAuthOptions
  ) {

    authParam.tokenStorageProvider = vaultSrvc.vault;
    super(authParam);
 
  }

  public subUser(): Observable<User> {
    return this.curUser.asObservable();
  }

  public subAuthState(): Observable<AuthState> {
    return this.curAuthState.asObservable();
  }

  public redirectIfAny(): string {
    console.log('redirectUrl', this.redirectUrl);
    return this.redirectUrl.length > 0 ? this.redirectUrl.pop() : TabRoutingKeys.BASE;
  }

  public addRedirect(url: string): void {
    this.redirectUrl.push(url);
  }

  public biometricLogin(): Observable<AuthState> {
    this.vaultSrvc.vault.config.androidBiometricsPromptTitle = 'Biometric Login for Moby';
    this.vaultSrvc.vault.config.iosBiometricsLocalizedFallbackTitle = 'Biometric Login for Moby';
    this.vaultSrvc.vault.config.androidBiometricsPromptDescription =
      'Unlock access to your account';
    const state = this.curAuthState.getValue();
    state.isLoggingIn = true;
    this.curAuthState.next(state);
    return from(this.vaultSrvc.vault.unlock()).pipe(
      mergeMap((res) => {
        return this.refreshToken();
      }),
      mergeMap((usr, _) => {
        return this.userApi.retrieveUser(usr);
      }),
      map((usr) => this.loginComplete(usr)),
      catchError((err) => {
        console.log(err)
        const errState = this.curAuthState.getValue();
        // errState.hasSavedToken = false;
        errState.isLoggingIn = false;
        errState.isRetrievingUserDetails = false;
        errState.loginSuccess = false
        this.curAuthState.next(errState);
        return throwError(err);
      })
    );
  }

  public hasSavedToken(): Observable<boolean> {
    return combineLatest([from(this.vaultSrvc.vault.doesVaultExist())]).pipe(
      map(([hasSession]) => {
        console.log(hasSession)
        const state = this.curAuthState.getValue();
        state.hasSavedToken = hasSession;
        this.curAuthState.next(state);
        return state.hasSavedToken;
      }),
      catchError((err) => {
        this.errService.logError(err);
        return of(false);
      })
    );
  }

  public signIn(): Observable<AuthState> {
    const state = this.curAuthState.getValue();
    state.isLoggingIn = true;
    state.loadedOAuth = true;
    this.curAuthState.next(state);
    return from(this.vaultSrvc.vault.clear()).pipe(
      mergeMap((_) => {
        return from(super.login());
      }),
      mergeMap((_) => {
        return from(super.getAuthResponse());
      }),
      mergeMap((loginInfo, _) => {
        const newState = this.curAuthState.getValue();
        newState.isRetrievingUserDetails = true;
        this.curAuthState.next(newState);
        const usr = this.curUser.getValue();
        this.userApi.mapLoginInfo(loginInfo, usr);
        this.curUser.next(usr);
        return this.userApi.retrieveUser(usr);
      }),
      map((usr) => {
        // this.vaultSrvc.setSession(usr.accessToken)
        return this.loginComplete(usr);
      }), 
      catchError((err) => {
        const errState = this.curAuthState.getValue();
        errState.hasSavedToken = false;
        errState.isLoggingIn = false;
        errState.loginSuccess = false;
        errState.isRetrievingUserDetails = false;
        this.curAuthState.next(errState);
        return throwError(err);
      })
    );
  }

  public signOut() {
    return from(this.vaultSrvc.vault.clear())
      .pipe(
        mergeMap((_) => {
          return from(super.clearStorage());
        })
      )
      .subscribe(
        (_) => {
          const usr = this.curUser.getValue();
          usr.isLoggedIn = false;
          this.curUser.next(usr);
          const curState = this.curAuthState.getValue();
          curState.hasSavedToken = false;
          curState.loginSuccess = false;
          this.curAuthState.next(curState);
        },
        (err) => {
          throw err;
        }
      );
  }

  public freshTokenCheck(): Observable<string> {
    if (this.curUser == null) {
      throw new Error('authService:freshTokenCheck:curUser is null');
    }
    const usr = this.curUser.getValue();
    let retrieveToken: Observable<string>;
    const now = new Date();
    if (usr.accessExpiry > now) {
      retrieveToken = of(usr.accessToken);
    } else {
      retrieveToken = this.refreshToken().pipe(map((u) => {
        console.log(u)
        return u.accessToken;
      }));
    }

    return retrieveToken;
  }

  private refreshToken(): Observable<User> {
    return from(this.vaultSrvc.vault.unlock()).pipe(
      mergeMap((_) => {
        return from(super.refreshSession()).pipe(
          take(1),
          timeout(5000),
          mergeMap((_) => {
            return from(super.getAuthResponse());
          }),
          mergeMap((loginInfo) => {
            console.log(loginInfo)
            const curState = this.curAuthState.getValue();
            curState.hasSavedToken = true;
            curState.isLoggingIn = true;
            curState.isRetrievingUserDetails = true;
            this.curAuthState.next(curState);
            const usr = this.curUser.getValue();
            this.userApi.mapLoginInfo(loginInfo, usr);
            this.curUser.next(usr);
            return this.userApi.retrieveUser(usr);
          }),
          catchError((err) => {
            this.errService.logError(`refreshToken Error: ${JSON.stringify(err)}`);
            if (this.isAuthStateErr(err)) {
              // bad oauth token error
              this.signOut();
            }
            throw err;
          })
        );
      })
    );
  }

  private loginComplete(usr: User): AuthState {
    
    
    const newAuthState = this.curAuthState.getValue();
    newAuthState.isLoggingIn = false;
    newAuthState.isRetrievingUserDetails = false;
    newAuthState.loginSuccess = true;
    newAuthState.hasSavedToken = true;
    this.curAuthState.next(newAuthState);
    usr.isLoggedIn = true;
    this.curUser.next(usr);
    return newAuthState;
  }

  private isAuthStateErr(err) {
    if (err instanceof Array) {
      return err.some((x) => this.isAuthStateErr(x));
    } else {
      return (
        err && (err.status === 403 || (typeof err === 'string' && (err.indexOf('expired access/refresh token') >= 0 || err.indexOf('AppAuth Error') >= 0)))
      );
    }
  }

  normalizer():void{
    const newAuthState = this.curAuthState.getValue();
    newAuthState.hasSavedToken = false,
    newAuthState.loginSuccess = false,
    newAuthState.isLoggingIn = false,
    newAuthState.isRetrievingUserDetails = false
    this.curAuthState.next(newAuthState)
  }
}
