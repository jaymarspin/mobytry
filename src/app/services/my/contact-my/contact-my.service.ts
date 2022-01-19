import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { from, Observable, of, Subject, zip } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { IContactsApi } from 'src/app/interfaces/contact-api.interface';
import { VehicleOwnership } from 'src/app/models/common/vehicle-ownership.model';
import { ContactModelMY } from 'src/app/models/my/contact-my.model';
import { Query } from 'src/app/models/sg/query.model';
import { ApiService } from '../../common/api/api.service';
import { ErrorService } from '../../common/error/error.service';
import { ApiMY } from '../api/api-my.service';

@Injectable({
  providedIn: 'root',
})
export class ContactServiceMY implements IContactsApi<ContactModelMY> {
  private currContacts: ContactModelMY[] = [];
  private offset = 0;
  public readonly ContactGetAPI = 'api/contact/get';
  public readonly ContactSetAPI = 'api/contact/set';

  constructor(private api: ApiService, private apiSettings: ApiMY, private alertCtrl: AlertController, private errorSrvc: ErrorService) {}

  public isSFAccId(id: string): boolean {
    return id.startsWith('001');
  }
  public isSFContactId(id: string): boolean {
    return id.startsWith('003');
  }
  public isSFLdId(id: string): boolean {
    return id.startsWith('00Q');
  }

  getContactById(id: string): Observable<ContactModelMY> {
    if (!id) {
      throw new Error('Invalid Id.');
    }
    let query: string;
    if (this.isSFAccId(id)) {
      query = `${this.queryAccount()} WHERE Id = '${id}'`;
    } else if (this.isSFContactId(id)) {
      query = `${this.queryAccount()} WHERE PersonContactId = '${id}'`;
    } else if (this.isSFLdId(id)) {
      query = `${this.queryLead()} WHERE Id = '${id}'`;
    } else {
      throw new Error(`Unrecognized Id: ${id}`);
    }
    return this.api.get<Query>(this.apiSettings.getQueryUrl(query)).pipe(
      map((res) => {
        if (!res || !res.records || res.records.length <= 0) {
          return [];
        }
        return res.records.map((contactObj) => {
          if (this.isSFAccId(contactObj.Id)) {
            return this.fromAccount(contactObj);
          } else if (this.isSFLdId(contactObj.Id)) {
            return this.fromLead(contactObj);
          } else {
            throw new Error(`Unrecognized Id: ${id}`);
          }
        });
      }),
      map((contacts: ContactModelMY[]) => {
        return contacts && contacts.length > 0 ? contacts[0] : null;
      })
    );
  }

  private queryLead(): string {
    return `SELECT ${this.leadFields()} FROM Lead `;
  }

  private leadFields(prefix = ''): string {
    return (
      `${prefix}Id, ${prefix}Salutation, ${prefix}Surname__c, ${prefix}Name, ${prefix}Mobile_Preferred__c, ${prefix}Email, ` +
      `${prefix}Partial_Document_Number__c, ${prefix}Doc_Type__c, ${prefix}NRIC_Number__c, ${prefix}Country__c `
    );
  }

  private fromLead(sfContact: any): ContactModelMY {
    const rv = new ContactModelMY();
    rv.Id = sfContact.Id;
    rv.Title = sfContact.Salutation;
    rv.Name = sfContact.Name;
    rv.Surname = sfContact.Surname__c;
    rv.Email = sfContact.Email;
    rv.CountryCode = sfContact.Mobile_Country_Code_1__pc != null ? sfContact.Mobile_Country_Code_1__pc.toString() : '';
    rv.MobileNo = sfContact.Mobile_Preferred__c;
    rv.DocType = this.setFormDocType(sfContact.Doc_Type__c, sfContact.NRIC_Number__c);
    rv.DocNum = sfContact.NRIC_Number__c ? sfContact.NRIC_Number__c : sfContact.Partial_Document_Number__c;
    rv.DocCountry = sfContact.Country__c;
    return rv;
  }

  getContactByName(name?: string): Observable<ContactModelMY[]> {
    this.currContacts = [];
    this.offset = 0;
    const sqlStatement = name
      ? `WHERE IsPersonAccount = true AND Name LIKE '%${name}%' ORDER BY Name LIMIT 10 OFFSET ${this.offset}`
      : `WHERE IsPersonAccount = true ORDER BY Name LIMIT 10 OFFSET ${this.offset}`;
    const queries: Observable<ContactModelMY[]>[] = [];
    queries.push(
      this.api.get<Query>(this.apiSettings.getQueryUrl(`${this.queryAccount()} ` + sqlStatement)).pipe(
        map((res) => {
          if (!res || !res.records || res.records.length <= 0) {
            return [];
          }
          return res.records.map((contactObj) => {
            return this.fromAccount(contactObj);
          });
        })
      )
    );
    return zip(...queries).pipe(
      map((obj) => {
        const rv = [];
        obj.forEach((val) => rv.push(...val));
        return rv;
      }),
      tap((arr) => {
        arr.forEach((contact) => {
          this.currContacts.push(contact);
        });
        this.offset = this.offset + arr.length;
      }),
      map((arr) => {
        return this.currContacts;
      })
    );
  }

  getContactsByDoc(docNum: string): Observable<ContactModelMY[]> {
    const data = { Nric: docNum };
    return this.api.post(this.api.getAPIUrl(this.ContactGetAPI), data).pipe(
      map((contacts: any) => {
        return contacts.map((contact: any) => {
          return this.mapContact(contact);
        });
      })
    );
  }

  getContactByEmail(email: string): Observable<ContactModelMY[]> {
    return null;
  }

  getRecentContacts(): Observable<ContactModelMY[]> {
    const queries: Observable<ContactModelMY[]>[] = [];
    queries.push(
      this.api
        .get<Query>(
          this.apiSettings.getQueryUrl(
            `${this.queryAccount()} WHERE IsPersonAccount = true AND ` +
              `(LastViewedDate != null OR LastReferencedDate != null) ` +
              `ORDER BY LastReferencedDate DESC NULLS LAST,LastViewedDate DESC NULLS LAST LIMIT 5`
          )
        )
        .pipe(
          map((res) => {
            if (!res || !res.records || res.records.length <= 0) {
              return [];
            }
            return res.records.map((contactObj) => {
              return this.fromAccount(contactObj);
            });
          })
        )
    );
    return zip(...queries).pipe(
      map((obj) => {
        const rv = [];
        obj.forEach((val) => rv.push(...val));
        return rv;
      })
    );
  }

  public accountFields(prefix = ''): string {
    return (
      `${prefix}Id, ${prefix}IsPersonAccount, ${prefix}Salutation, ${prefix}Account_Name__c, ${prefix}LastName, ${prefix}Mobile_Country_Code_1__pc, ` +
      `${prefix}Mobile_Preferred__pc, ${prefix}Default_Email__c, ${prefix}NRIC_Number__c, ${prefix}Doc_Type__c, ${prefix}Country__c, ` +
      `${prefix}Partial_NRIC__c `
    );
  }

  public queryAccount(): string {
    return `SELECT ${this.accountFields()} FROM Account `;
  }

  public fromAccount(sfContact: any): ContactModelMY {
    const rv = new ContactModelMY();
    rv.Id = sfContact.Id;
    rv.Title = sfContact.Salutation;
    rv.Name = sfContact.LastName;
    rv.Surname = sfContact.Account_Name__c;
    rv.Email = sfContact.Default_Email__c;
    rv.CountryCode = sfContact.Mobile_Country_Code_1__pc != null ? sfContact.Mobile_Country_Code_1__pc.toString() : '';
    rv.MobileNo = sfContact.Mobile_Preferred__pc;
    rv.DocType = this.setFormDocType(sfContact.Doc_Type__c, sfContact.NRIC_Number__c);
    rv.DocNum = sfContact.NRIC_Number__c ? sfContact.NRIC_Number__c : sfContact.Partial_NRIC__c;
    rv.DocCountry = sfContact.Country__c;
    return rv;
  }

  private setFormDocType(docType: string, docNum: string): string {
    if (!docType) {
      return '';
    }
    if (docNum && docType === 'Singapore NRIC / FIN (e.g. S1234567D)') {
      if (docNum.startsWith('S') || docNum.startsWith('T')) {
        return 'Singapore NRIC (e.g. S1234567D)';
      }
      if (docNum.startsWith('F') || docNum.startsWith('G')) {
        return 'Foreign Identification Number (e.g. F/G1234567N)';
      }
      return '';
    } else if (docType === 'Foreign Document/Passport') {
      return 'Foreign Passport (e.g. 12345678)';
    }
    return docType;
  }

  getContactByPhoneAndName(mobile: string, name: string): Observable<ContactModelMY[]> {
    const queries: Observable<ContactModelMY[]>[] = [];
    queries.push(
      this.api
        .get<Query>(
          this.apiSettings.getQueryUrl(
            `${this.queryAccount()} WHERE IsPersonAccount = true AND (Mobile_Preferred__pc LIKE '%${mobile}%' AND LastName LIKE '%${name}%') LIMIT 10`
          )
        )
        .pipe(
          map((res) => {
            if (!res || !res.records || res.records.length <= 0) {
              return [];
            }
            return res.records.map((contactObj) => {
              return this.fromAccount(contactObj);
            });
          })
        )
    );
    return zip(...queries).pipe(
      map((obj) => {
        const rv = [];
        obj.forEach((val) => rv.push(...val));
        return rv;
      })
    );
  }

  searchByKeyword(keyword?: string): Observable<ContactModelMY[]> {
    if (!keyword || keyword.length <= 2) {
      return of([]);
    }
    let query = `${this.queryAccount()} WHERE  IsPersonAccount = true AND (`;
    const wildCardStrings = ['LastName'];
    const searchStrings = ['Mobile_Preferred__pc'];
    query += wildCardStrings
      .map((s) => {
        const searchSplit = keyword.split(/\s/g);
        const splitSearchClause = searchSplit.map((key) => `${s} LIKE '%${key}%'`);
        return `(${splitSearchClause.join(' AND ')})`;
      })
      .join(' OR ');
    query += ' OR ';
    query += searchStrings.map((s) => `${s} LIKE '%${keyword}%'`).join(' OR ');
    query += ') ORDER BY CreatedDate DESC LIMIT 10';
    return this.api.get<Query>(this.apiSettings.getQueryUrl(query)).pipe(
      map((res) => {
        if (!res || !res.records || res.records.length <= 0) {
          return [];
        }
        return res.records.map((contactObj) => this.fromAccount(contactObj));
      })
    );
  }

  getContactByMobile(mobile: string): Observable<ContactModelMY[]> {
    if (!mobile) {
      throw new Error('Empty Mobile.');
    }
    const queries: Observable<ContactModelMY[]>[] = [];
    queries.push(
      this.api
        .get<Query>(this.apiSettings.getQueryUrl(`${this.queryAccount()} WHERE IsPersonAccount = true AND Mobile_Preferred__pc ='${mobile}' LIMIT 10`))
        .pipe(
          map((res) => {
            if (!res || !res.records || res.records.length <= 0) {
              return [];
            }
            return res.records.map((contactObj) => {
              return this.fromAccount(contactObj);
            });
          })
        )
    );
    return zip(...queries).pipe(
      map((obj) => {
        const rv = [];
        obj.forEach((val) => rv.push(...val));
        return rv;
      })
    );
  }

  setContact(data: ContactModelMY, isReplace = false): Observable<ContactModelMY> {
    console.log(data);
    const req = {
      sfId: data.Id,
      salutation: data?.Title,
      fullName: data?.Name,
      mobile: data?.MobileNo,
      mobileCountryCode: data?.CountryCode,
      email: data?.Email,
      docType: data.DocType ? this.setSFDocType(data.DocType) : null,
      docNum: data?.DocNum,
      docCountry: data?.DocCountry,
      isReplace,
    };
    return this.api.post<UpsertResp>(this.apiSettings.getAPIUrl('assistant/customer/upsert'), req).pipe(
      mergeMap((res) => this.getContactById(res.custId)),
      catchError((err) => {
        if (err && err.status === 409) {
          return this.displayUniquenessAlert(err, data);
        } else {
          this.errorSrvc.presentServerErr(err);
          throw err;
        }
      })
    );
  }

  setSFDocType(docType: string): string {
    switch (docType) {
      case 'Foreign Passport':
        return 'Foreign Passport';
      case 'Malaysia NRIC':
      case 'Foreign Identification Number':
      default:
        return docType;
    }
  }

  private displayUniquenessAlert(err: any, contact: ContactModelMY): Observable<ContactModelMY> {
    if (!err || !err.error || !err.error.custId) {
      return;
    }
    const errMsg = err.error.err ? err.error.err : 'Error found. Likely conflict with existing customer.';
    const responseSubj = new Subject<ContactModelMY>();
    from(
      this.alertCtrl.create({
        header: 'Tag to existing customer?',
        message: errMsg,
        mode: 'ios',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              responseSubj.complete();
            },
          },
          {
            text: 'No',
            handler: () => {
              this.setContact(contact, true).subscribe(
                (res) => {
                  responseSubj.next(res);
                  responseSubj.complete();
                },
                (retryErr) => {
                  responseSubj.error(retryErr);
                }
              );
            },
          },
          {
            text: 'Yes',
            handler: () => {
              contact.Id = err.error.custId;
              this.setContact(contact).subscribe(
                (res) => {
                  responseSubj.next(res);
                  responseSubj.complete();
                },
                (retryErr) => {
                  responseSubj.error(retryErr);
                }
              );
            },
          },
        ],
      })
    ).subscribe((alert) => alert.present());
    return responseSubj.asObservable();
  }

  mapContact(contact: any): ContactModelMY {
    const con = new ContactModelMY();
    con.Name = contact.ContactName;
    con.Id = contact.Id;
    con.MobileNo = contact.MobileNo;
    con.Title = contact.Title;
    con.DocNum = contact.ICNo;
    con.Email = contact.Email;
    return con;
  }

  getContactVehicleById(id: string): Observable<VehicleOwnership[]> {
    const vehId = [0, 1, 2];
    return of(
      vehId.map((i) => {
        const veh = new VehicleOwnership();
        veh.Id = i.toString();
        veh.BranchName = 'Auto Bavaria Ara Damansara';
        veh.ContactId = '2';
        veh.Name = 'Davis Lim Tiong Hean';
        veh.PlateNumber = 'JAG 99';
        veh.PurchasedDate = new Date();
        veh.Vehicle = 'BMW 118Mi M Sport (F20)';
        return veh;
      })
    );
  }
}

class UpsertResp {
  custId: string;
  err: string;
}
