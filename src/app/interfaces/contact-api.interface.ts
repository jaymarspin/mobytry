import { Observable } from 'rxjs';
import { ContactModel } from '../models/common/contact.model';
import { VehicleOwnership } from '../models/common/vehicle-ownership.model';

export interface IContactsApi<T> {
  getContactById(id: string): Observable<T>;
  getContactsByDoc(docNum: string): Observable<T[]>;
  getContactByName(name: string): Observable<T[]>;
  getContactByEmail(email: string): Observable<T[]>;
  getRecentContacts(): Observable<T[]>;
  getContactByMobile(mobile: string): Observable<T[]>;
  getContactByPhoneAndName(mobile: string, name: string): Observable<T[]>;
  setContact(param: ContactModel): Observable<T>;
  getContactVehicleById(id: string): Observable<VehicleOwnership[]>;
  searchByKeyword(keyword: string): Observable<T[]>;
}
