import { ContactModel } from '../common/contact.model';

export class ContactModelMY extends ContactModel {
  Nickname: string;
  Address: string;
  Birthday: string;
  LicenseNo: string;
  Source: string;
  EventId: number;
  MaritalStatusId: number;
  IncomeGroupId: number;
  Interests: string;
  IsActive: boolean;

  constructor(values: object = {}) {
    super(values);
    Object.assign(this, values);
  }
}
