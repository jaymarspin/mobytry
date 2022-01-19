import { AuthParam } from 'src/app/models/common/auth-params.model';
import { environment } from 'src/environments/environment';
import { IonicAuthOptions } from '@ionic-enterprise/auth';

export const AUTH_PARAM_MY: IonicAuthOptions = {
  authConfig: 'salesforce',
  // authUrl: environment.production
  //   ? 'https://login.salesforce.com/'
  //   : 'https://test.salesforce.com/',
  // tokenUrl: environment.production
  //   ? 'https://login.salesforce.com/'
  //   : 'https://test.salesforce.com/',
  clientID: '3MVG9Y6d_Btp4xp70yV0DYzfC9YJYdMH9aoJoUSF5664vksh8NrAeBSZeUEX8Atqq_asb7YOzoYNvfPUkhlMl',
  scope: 'full refresh_token offline_access web openid',
  redirectUri: 'com.simedarbymotors.appauth://login_redirect',
  platform: 'capacitor',
  discoveryUrl: environment.production
    ? 'https://login.salesforce.com/.well-known/openid-configuration'
    : 'https://test.salesforce.com/.well-known/openid-configuration',
  audience: '',
  logoutUrl: 'com.my.moby.motors.simedarby',
  iosWebView: 'private',
  clientSecret: '',
  logLevel: 'DEBUG',
};
