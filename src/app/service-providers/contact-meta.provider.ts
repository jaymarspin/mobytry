import { environment } from 'src/environments/environment';
import { ContactMeta } from '../models/common/contact-meta.model';
import { ContactMetaSG } from '../services/sg/contact-sg/contact-meta-sg.value';
import { ContactMetaMY } from '../services/my/contact-my/contact-meta-my.value';

export const CONTACT_META_KEY = 'ContactMeta';
// This function returns the country specific instance based on the country code given
export function getContactMeta(): ContactMeta {
  switch (environment.countryCode) {
    case 'sg':
      return ContactMetaSG;
    case 'my':
      return ContactMetaMY;
  }
}
