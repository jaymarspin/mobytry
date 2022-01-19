import { SelectOption } from './select-option.model';

export class ContactMeta {
  salutation: SelectOption[];
  docType: SelectOption[];
  states: SelectOption[];
  cities: SelectOption[];
  defaultCountryCode: string;
  countryCode: SelectOption[];
  countryList: SelectOption[];
  genderList: SelectOption[];
  raceList: SelectOption[];
}
