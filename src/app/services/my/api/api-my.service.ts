import { Injectable } from '@angular/core';
import { IAPI } from 'src/app/interfaces/api.interface';
import { Observable } from 'rxjs';
import { Header } from 'src/app/interfaces/header.interface';
import { map } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import { AuthenticationService } from '../../common/auth/auth.service';
import { User } from 'src/app/models/common/user.model';

@Injectable({
  providedIn: 'root',
})
export class ApiMY implements IAPI {
  private user: User;
  private readonly SF_VERSION = 'v48.0';
  constructor(private authService: AuthenticationService) {
    this.authService.subUser().subscribe((u) => {
      this.user = u;
    });
  }

  public getInstanceUrl(): string {
    if (this.user == null || this.user === undefined) {
      throw new Error('User still undefined. Unable to retrieve instance URL.');
    } else {
      return this.user.instanceUrl;
    }
  }

  public getHttpOptions(type: string): Observable<Header> {
    if (this.user == null) {
      throw new Error('User still undefined. Unable to retrieve HTTP Options.');
    }
    return this.authService.freshTokenCheck().pipe(
      map((res) => {
        return {
          headers: new HttpHeaders({
            'Content-Type': type,
            Authorization: `Bearer ${res}`,
          }),
        };
      })
    );
  }

  public getInsertUrl(objType: string): string {
    return `${this.getInstanceUrl()}/services/data/${this.SF_VERSION}/sobjects/${objType}`;
  }

  public getUpdateUrl(objType: string, id: string): string {
    return `${this.getInstanceUrl()}/services/data/${this.SF_VERSION}/sobjects/${objType}/${id}`;
  }

  public getPicklistUrl(objType: string, rtId: string, fieldName: string): string {
    return `${this.getInstanceUrl()}/services/data/${this.SF_VERSION}/ui-api/object-info/${objType}/picklist-values/` + `${rtId ? `${rtId}/` : ''}${fieldName}`;
  }

  public getMetadataUrl(objType: string): string {
    return `${this.getInstanceUrl()}/services/data/${this.SF_VERSION}/ui-api/object-info/${objType}`;
  }

  public getQueryUrl(query: string): string {
    const urlFriendly = encodeURI(query);
    return `${this.getInstanceUrl()}/services/data/${this.SF_VERSION}/query/?q=${urlFriendly}`;
  }

  public getSearchUrl(query: string): string {
    const urlFriendly = encodeURI(query);
    return `${this.getInstanceUrl()}/services/data/${this.SF_VERSION}/search/?q=${urlFriendly}`;
  }

  public getAPIUrl(url): string {
    return `${this.getInstanceUrl()}/services/apexrest/${url}`;
  }

  public getNextRecordsUrl(url): string {
    return `${this.getInstanceUrl()}${url}`;
  }
}
