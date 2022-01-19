import { AuthParam } from 'src/app/models/common/auth-params.model';
import { environment } from 'src/environments/environment';
import { AUTH_PARAM_MY } from '../services/my/auth-param/auth-param-my.value';
import { AUTH_PARAM_SG } from '../services/sg/auth-param/auth-param-sg.value';
import { IonicAuthOptions } from '@ionic-enterprise/auth';

export const AUTH_PARAM_KEY = 'AuthParamValue';
// This function returns the country specific instance based on the country code given
export function getAuthParam(): IonicAuthOptions {
  switch (environment.countryCode) {
    case 'sg':
      return AUTH_PARAM_SG;
    case 'my':
      return AUTH_PARAM_MY;
  }
}
