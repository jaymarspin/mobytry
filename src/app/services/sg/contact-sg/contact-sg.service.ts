import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { from, Observable, of, Subject, zip } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { IContactsApi } from 'src/app/interfaces/contact-api.interface';
import { VehicleOwnership } from 'src/app/models/common/vehicle-ownership.model';
import { ContactModelSG } from 'src/app/models/sg/contact-sg.model';
import { Query } from 'src/app/models/sg/query.model';
import { parseSFDate } from 'src/app/util/sf.date.util';
import { ApiService } from '../../common/api/api.service';
import { ErrorService } from '../../common/error/error.service';
import { ApiSG } from '../api/api-sg.service';

@Injectable({
  providedIn: 'root',
})
export class ContactServiceSG implements IContactsApi<ContactModelSG> {
  constructor(private api: ApiService, private apiSettings: ApiSG, private alertCtrl: AlertController, private errorSrvc: ErrorService) {}

  public isSFAccId(id: string): boolean {
    return id.startsWith('001');
  }
  public isSFContactId(id: string): boolean {
    return id.startsWith('003');
  }
  public isSFLdId(id: string): boolean {
    return id.startsWith('00Q');
  }

  getContactById(id: string): Observable<ContactModelSG> {
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
      map((contacts: ContactModelSG[]) => {
        return contacts && contacts.length > 0 ? contacts[0] : null;
      })
    );
  }

  getContactsByDoc(docNum: string): Observable<ContactModelSG[]> {
    const query = `${this.queryAccount()} WHERE IsPersonAccount = true AND NRIC_Number__c LIKE '%${docNum}%' LIMIT 10`;
    return this.api.get<Query>(this.apiSettings.getQueryUrl(query)).pipe(
      map((res) => {
        if (!res || !res.records || res.records.length <= 0) {
          return [];
        }
        return res.records.map((contactObj) => {
          return this.fromAccount(contactObj);
        });
      })
    );
  }

  getContactByEmail(email: string): Observable<ContactModelSG[]> {
    const query =
      `${this.queryAccount()} WHERE IsPersonAccount = true AND (Home_Email__c LIKE '%${email}%' OR Office_Email__c LIKE '%${email}%' OR ` +
      `Work_Email__c LIKE '%${email}%') LIMIT 10`;
    return this.api.get<Query>(this.apiSettings.getQueryUrl(query)).pipe(
      map((res) => {
        if (!res || !res.records || res.records.length <= 0) {
          return [];
        }
        return res.records.map((contactObj) => {
          return this.fromAccount(contactObj);
        });
      })
    );
  }

  getRecentContacts(): Observable<ContactModelSG[]> {
    const queries: Observable<ContactModelSG[]>[] = [];
    queries.push(
      this.api
        .get<Query>(
          this.apiSettings.getQueryUrl(
            `${this.queryAccount()} WHERE IsPersonAccount = true AND ` +
              `(LastViewedDate != null OR LastReferencedDate != null) ` +
              `ORDER BY LastReferencedDate DESC NULLS LAST,LastViewedDate DESC NULLS LAST LIMIT 20`
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

  getContactByPhoneAndName(mobile: string, name: string): Observable<ContactModelSG[]> {
    const queries: Observable<ContactModelSG[]>[] = [];
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

  getContactByName(name: string): Observable<ContactModelSG[]> {
    const queries: Observable<ContactModelSG[]>[] = [];
    queries.push(
      this.api.get<Query>(this.apiSettings.getQueryUrl(`${this.queryAccount()} WHERE IsPersonAccount = true AND LastName LIKE '%${name}%' LIMIT 10`)).pipe(
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

  searchByKeyword(keyword?: string): Observable<ContactModelSG[]> {
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

  getContactByMobile(mobile: string): Observable<ContactModelSG[]> {
    if (!mobile) {
      throw new Error('Empty Mobile.');
    }
    const queries: Observable<ContactModelSG[]>[] = [];
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

  setContact(data: ContactModelSG, isReplace = false): Observable<ContactModelSG> {
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
      gender: data?.Gender,
      race: data?.Race,
      address1: data?.Line1,
      address2: data?.Line2,
      country: data?.Country,
      postalCode: data?.Postcode,
      prefName: data?.PrefName,
      company: data?.CompanyName,
      isReplace,
    };
    if (data?.Birthday) {
      req['dateOfBirth'] = data?.Birthday;
    }

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

  public accountFields(prefix = ''): string {
    return (
      `${prefix}Id, ${prefix}IsPersonAccount, ${prefix}Salutation, ${prefix}Account_Name__c, ${prefix}LastName, ${prefix}Mobile_Country_Code_1__pc, ` +
      `${prefix}Mobile_Preferred__pc, ${prefix}Default_Email__c, ${prefix}NRIC_Number__c, ${prefix}Doc_Type__c, ${prefix}Country__c, ` +
      `${prefix}Partial_NRIC__c, ${prefix}Race__pc, ${prefix}Gender__pc, ${prefix}Prefer_Name__pc, ${prefix}PersonBirthdate, ${prefix}Employer__c, ` +
      `${prefix}PersonMailingStreet, ${prefix}PersonMailingCity, ${prefix}PersonMailingCountry, ${prefix}PersonMailingPostalCode, ${prefix}PersonContactId `
    );
  }

  public queryAccount(): string {
    return `SELECT ${this.accountFields()} FROM Account `;
  }

  public fromAccount(sfContact: any): ContactModelSG {
    const rv = new ContactModelSG();
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
    rv.Race = sfContact.Race__pc;
    rv.Birthday = sfContact.PersonBirthdate;
    rv.Gender = sfContact.Gender__pc;
    rv.PrefName = sfContact.Prefer_Name__pc;
    rv.Line1 = sfContact.PersonMailingStreet;
    rv.Line2 = sfContact.PersonMailingCity;
    rv.Country = sfContact.PersonMailingCountry;
    rv.Postcode = sfContact.PersonMailingPostalCode;
    rv.CompanyName = sfContact.Employer__c;
    rv.PersonContactId = sfContact.PersonContactId;
    return rv;
  }

  public queryLead(): string {
    return `SELECT ${this.leadFields()} FROM Lead `;
  }

  public leadFields(prefix = ''): string {
    return (
      `${prefix}Id, ${prefix}Salutation, ${prefix}Surname__c, ${prefix}Name, ${prefix}Mobile_Preferred__c, ${prefix}Email, ` +
      `${prefix}Partial_Document_Number__c, ${prefix}Doc_Type__c, ${prefix}NRIC_Number__c, ${prefix}Country__c, ` +
      `${prefix}Race__c, ${prefix}Gender__c `
    );
  }

  public fromLead(sfContact: any): ContactModelSG {
    const rv = new ContactModelSG();
    rv.Id = sfContact.Id;
    rv.Title = sfContact.Salutation;
    rv.Name = sfContact.Name;
    rv.Surname = sfContact.Surname__c;
    rv.Email = sfContact.Email;
    rv.CountryCode = sfContact.Mobile_Country_Code_1__pc != null ? sfContact.Mobile_Country_Code_1__pc.toString() : '';
    rv.MobileNo = sfContact.Mobile_Preferred__c;
    rv.DocType = this.setFormDocType(sfContact.Doc_Type__c, sfContact.NRIC_Number__c);
    rv.DocNum = sfContact.NRIC_Number__c ? sfContact.NRIC_Number__c : sfContact.Partial_Document_Number__c;
    rv.Race = sfContact.Race__c;
    rv.Gender = sfContact.Gender__c;
    rv.DocCountry = sfContact.Country__c;
    rv.PersonContactId = sfContact.PersonContactId;
    return rv;
  }

  private displayUniquenessAlert(err: any, contact: ContactModelSG): Observable<ContactModelSG> {
    if (!err || !err.error || !err.error.custId) {
      return;
    }
    const errMsg = err.error.err ? err.error.err : 'Error found. Likely conflict with existing customer.';
    const responseSubj = new Subject<ContactModelSG>();
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
    ).subscribe((alert) => {
      responseSubj.next(null);
      alert.present();
    });
    return responseSubj.asObservable();
  }

  getContactVehicleById(id: string): Observable<VehicleOwnership[]> {
    let filter;
    if (this.isSFAccId(id)) {
      filter = `Customer__c = '${id}'`;
    } else if (this.isSFContactId(id)) {
      filter = `Customer__r.PersonContactId = '${id}'`;
    } else if (this.isSFLdId(id)) {
      return of([]);
    } else {
      throw new Error('Unknown Id Type.');
    }
    const query =
      `SELECT Id, Customer__r.Name, Vehicle__r.Name, Vehicle_Make__r.Name, Registration_No__c, Start_Date__c, Model_Description__c FROM ` +
      `Vehicle_Ownership__c WHERE ${filter}`;
    return this.api.get<Query>(this.apiSettings.getQueryUrl(query)).pipe(
      map((res) => {
        if (!res || !res.records || res.records.length <= 0) {
          return [];
        }
        return res.records.map((vo) => {
          const newVO = new VehicleOwnership();
          newVO.Id = vo.Id;
          newVO.ContactId = id;
          newVO.Name = vo.Customer__r.Name;
          newVO.PlateNumber = vo.Registration_No__c;
          newVO.PurchasedDate = parseSFDate(vo.Start_Date__c);
          const vehName = (vo.Vehicle_Make__r.Name ? vo.Vehicle_Make__r.Name : '') + ' ' + (vo.Model_Description__c ? vo.Model_Description__c : '');
          newVO.Vehicle = vehName;
          return newVO;
        });
      })
    );
  }
}

class UpsertResp {
  custId: string;
  err: string;
}
