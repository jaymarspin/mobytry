import { Inject, Injectable } from '@angular/core';
import { Contacts } from '@ionic-native/contacts/ngx';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { IContactsApi } from 'src/app/interfaces/contact-api.interface';
import { ContactMeta } from 'src/app/models/common/contact-meta.model';
import { CategorizedContact, ContactModel } from 'src/app/models/common/contact.model';
import { SelectOption } from 'src/app/models/common/select-option.model';
import { VehicleOwnership } from 'src/app/models/common/vehicle-ownership.model';
import { CONTACT_META_KEY } from 'src/app/service-providers/contact-meta.provider';
import { CONTACT_SERVICE_KEY } from 'src/app/service-providers/dynamic-key.provider';
import { ErrorService } from '../error/error.service';

@Injectable({
  providedIn: 'root',
})
export class CommonContactService {
  constructor(
    @Inject(CONTACT_SERVICE_KEY) private contactAPI: IContactsApi<ContactModel>,
    private errorSrvc: ErrorService,
    @Inject(CONTACT_META_KEY) private contactMetaParam: ContactMeta,
    private contacts: Contacts
  ) {}

  private recentContacts: BehaviorSubject<ContactModel[]> = new BehaviorSubject([]);

  public subRecentContacts(): Observable<ContactModel[]> {
    return this.recentContacts.asObservable();
  }

  getCities(): SelectOption[] {
    return this.contactMetaParam.cities;
  }

  getStates(): SelectOption[] {
    return this.contactMetaParam.states;
  }

  getDefaultCountryCode(): string {
    return this.contactMetaParam.defaultCountryCode;
  }

  getContactSalutation(): SelectOption[] {
    return this.contactMetaParam.salutation;
  }

  getContactDocType(): SelectOption[] {
    return this.contactMetaParam.docType;
  }

  getCountryCodeList(): SelectOption[] {
    return this.contactMetaParam.countryCode;
  }

  getCountryList(): SelectOption[] {
    return this.contactMetaParam.countryList;
  }

  getGender(): SelectOption[] {
    return this.contactMetaParam.genderList;
  }

  getRace(): SelectOption[] {
    return this.contactMetaParam.raceList;
  }

  getRecentContacts(): Observable<ContactModel[]> {
    try {
      return this.contactAPI.getRecentContacts().pipe(
        tap((res) => {
          this.updateRecentContactList(res);
        })
      );
    } catch (e) {
      this.errorSrvc.presentServerErr(e);
    }
  }

  searchByPhoneAndName(mobile: string, name: string): Observable<ContactModel[]> {
    try {
      if ((mobile && mobile.trim()) || (name && name.trim())) {
        return this.contactAPI.getContactByPhoneAndName(mobile, name);
      }
    } catch (e) {
      this.errorSrvc.presentServerErr(e);
    }
  }

  searchByDocNum(searchKey: string): Observable<ContactModel[]> {
    try {
      if (searchKey && searchKey.trim()) {
        return this.contactAPI.getContactsByDoc(searchKey);
      }
    } catch (e) {
      this.errorSrvc.presentServerErr(e);
    }
  }

  searchByPhoneNumber(searchKey: string): Observable<ContactModel[]> {
    try {
      if (searchKey && searchKey.trim()) {
        return this.contactAPI.getContactByMobile(searchKey);
      }
    } catch (e) {
      this.errorSrvc.presentServerErr(e);
    }
  }

  searchByEmail(searchKey: string): Observable<ContactModel[]> {
    try {
      if (searchKey && searchKey.trim()) {
        return this.contactAPI.getContactByEmail(searchKey);
      }
    } catch (e) {
      this.errorSrvc.presentServerErr(e);
    }
  }

  searchByName(searchKey: string): Observable<ContactModel[]> {
    try {
      return this.contactAPI.getContactByName(searchKey);
    } catch (e) {
      this.errorSrvc.presentServerErr(e);
    }
  }

  getContactById(searchKey: string): Observable<ContactModel> {
    try {
      if (searchKey && searchKey.trim()) {
        return this.contactAPI.getContactById(searchKey).pipe(
          tap((res) => {
            this.updateRecentContactList([res]);
          })
        );
      }
    } catch (e) {
      this.errorSrvc.presentServerErr(e);
    }
  }

  importContact(): Observable<ContactModel> {
    try {
      return from(this.contacts.pickContact()).pipe(
        map((e) => {
          const con = new ContactModel();
          con.Name = e.name.formatted;
          if (e.phoneNumbers !== null) {
            con.MobileNo = e.phoneNumbers[0].value.trim();
          } else {
            con.MobileNo = null;
          }
          return con;
        })
      );
    } catch (e) {
      this.errorSrvc.presentServerErr(e);
    }
  }

  upsertContact(contact: ContactModel): Observable<ContactModel> {
    try {
      return this.contactAPI.setContact(contact);
    } catch (e) {
      this.errorSrvc.presentServerErr(e);
    }
  }

  getContactVehicleById(id: string): Observable<VehicleOwnership[]> {
    try {
      return this.contactAPI.getContactVehicleById(id);
    } catch (e) {
      this.errorSrvc.presentServerErr(e);
    }
  }

  getLetterScroll(): string[] {
    return new Array(26).fill(1).map((_, i) => String.fromCharCode(65 + i));
  }

  searchContactByKeyword(searchKey?: string): Observable<ContactModel[]> {
    try {
      return this.contactAPI.searchByKeyword(searchKey);
    } catch (e) {
      this.errorSrvc.presentServerErr(e);
    }
  }

  getCategorizedContact(searchKey?: string): Observable<CategorizedContact[]> {
    return this.searchByName(searchKey).pipe(
      map((e) => {
        const tempContacts = new Array<CategorizedContact>();
        e.forEach((el) => {
          if (tempContacts.length < 1) {
            tempContacts.push({
              header: el.Name.charAt(0).toLocaleUpperCase(),
              contacts: [],
            });
            tempContacts[tempContacts.length - 1].contacts.push(el);
          } else {
            if (tempContacts[tempContacts.length - 1].header === el.Name.charAt(0).toLocaleUpperCase()) {
              tempContacts[tempContacts.length - 1].contacts.push(el);
            } else {
              tempContacts.push({
                header: el.Name.charAt(0).toLocaleUpperCase(),
                contacts: [],
              });
              tempContacts[tempContacts.length - 1].contacts.push(el);
            }
          }
        });
        tempContacts.sort((a, b) => a.header.localeCompare(b.header));
        return tempContacts;
      })
    );
  }

  private updateRecentContactList(contactList: ContactModel[]): void {
    const curRecentList = this.recentContacts.value;
    const newList = [...contactList];
    const curIds = new Set();
    for (const contact of contactList) {
      curIds.add(contact.Id);
    }
    for (const contact of curRecentList) {
      if (!curIds.has(contact.Id)) {
        newList.push(contact);
      }
    }
    this.recentContacts.next(newList);
  }
}
