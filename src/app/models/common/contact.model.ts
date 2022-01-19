export class ContactModel {
  Id: string;
  Title: string;
  Name: string;
  Surname: string;
  Email: string;
  CountryCode: string;
  MobileNo: string;
  DocType: string;
  DocNum: string;
  DocCountry: string;
  CreatedDate: string;
  Gender: string;
  Race: string;
  Line1: string;
  Line2: string;
  CompanyName: string;
  Flag: boolean;
  Postcode: string;
  City: string;
  State: string;
  Country: string;
  PersonContactId: string;
  Remarks?: string;
  PrefName?: string;
  Birthday?: string;

  constructor(values: object = {}) {
    Object.assign(this, values);
  }
}

export class CategorizedContact {
  header: string;
  contacts: ContactModel[];

  constructor(values: object = {}) {
    Object.assign(this, values);
  }
}
