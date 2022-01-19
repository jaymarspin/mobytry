import { Injectable, Inject } from '@angular/core';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { ErrorService } from '../error/error.service';
import { HttpClient } from '@angular/common/http';
import { IAPI } from 'src/app/interfaces/api.interface';
import { API_SERVICE_KEY } from 'src/app/service-providers/dynamic-key.provider';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(public http: HttpClient, private err: ErrorService, @Inject(API_SERVICE_KEY) private apiSettings: IAPI) {}

  public getAPIUrl(url: string): string {
    return this.apiSettings.getAPIUrl(url);
  }

  public get<T>(url: string, addOpt?: any): Observable<T> {
    return this.apiSettings.getHttpOptions('application/json').pipe(
      mergeMap((opt, _) => {
        Object.assign(opt, addOpt);
        return this.http.get<T>(url, opt);
      }),
      catchError((err) => this.catchErr<T>(err))
    );
  }

  public post<T>(url: string, body: any, contentType = 'application/json', addOpt?: any): Observable<T> {
    return this.apiSettings.getHttpOptions(contentType).pipe(
      mergeMap((opt, _) => {
        Object.assign(opt, addOpt);
        console.log(url);
        console.log(body);
        console.log(opt);
        return this.http.post<T>(url, body, opt);
      }),
      catchError((err) => this.catchErr<T>(err))
    );
  }

  public patch<T>(url: string, body: any, addOpt?: any): Observable<T> {
    return this.apiSettings.getHttpOptions('application/json').pipe(
      mergeMap((opt, _) => {
        Object.assign(opt, addOpt);
        return this.http.patch<T>(url, body, opt);
      }),
      catchError((err) => this.catchErr<T>(err))
    );
  }

  // helper method to merge two list with the same id
  public combineExisting<T>(x: T[], y: T[], compareFn: (a: T, b: T) => boolean): T[] {
    let findInd;
    if (!x || !(x instanceof Array)) {
      if (!y || !(y instanceof Array)) {
        return [];
      } else {
        return y;
      }
    }
    for (const i of y) {
      findInd = x.findIndex((existing) => compareFn(existing, i));
      if (findInd >= 0) {
        x[findInd] = i;
      } else {
        x.push(i);
      }
    }
    return x;
  }

  public catchErr<T>(e): Observable<T> {
    this.err.logError(e);
    return throwError(e);
  }

  public postBlob(url: string, body: any, type: string): Observable<Blob> {
    return this.apiSettings.getHttpOptions(type).pipe(
      map((opt) => {
        opt.responseType = 'blob' as 'json';
        return opt;
      }),
      mergeMap((opt, _) => this.http.post<Blob>(url, body, opt)),
      catchError((err) => this.catchErr<Blob>(err))
    );
  }
}
