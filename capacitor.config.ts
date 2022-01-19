require('dotenv').config({
  path: `${process.cwd()}/src/environments/config/.env`,
});
import { CapacitorConfig } from '@capacitor/cli';

const configMap: { [key: string]: { [key: string]: CapacitorConfig } } = {
  my: {
    prod: {
      appId: 'com.simedarbymotors.my.moby.sales',
      appName: 'Moby MY',
      bundledWebRuntime: false,
      webDir: 'www',
      android: {
        path: 'android/my-prod',
      },
      ios: {
        path: 'ios/my-prod',
      },
      cordova: {
        preferences: {
          URL_SCHEME: 'com.simedarbymotors.appauth:*',
        },
      },
    },
    test: {
      appId: 'com.simedarbymotors.my.moby.sales.dev',
      appName: 'Moby MY TEST',
      bundledWebRuntime: false,
      webDir: 'www',
      android: {
        path: 'android/my-test',
      },
      ios: {
        path: 'ios/my-test',
      },
      cordova: {
        preferences: {
          URL_SCHEME: 'com.simedarbymotors.appauth:*',
        },
      },
    },
  },
  sg: {
    prod: {
      appId: 'com.simedarbymotors.sg.moby.sales',
      appName: 'Moby SG',
      bundledWebRuntime: false,
      webDir: 'www',
      android: {
        path: 'android/sg-prod',
      },
      ios: {
        path: 'ios/sg-prod',
      },
      cordova: {
        preferences: {
          URL_SCHEME: 'com.simedarbymotors.appauth://',
        },
      },
    },
    test: {
      appId: 'com.simedarbymotors.sg.moby.sales.dev',
      appName: 'Moby SG TEST',
      bundledWebRuntime: false,
      webDir: 'www',
      android: {
        path: 'android/sg-test',
      },
      ios: {
        path: 'ios/sg-test',
      },
      cordova: {
        preferences: {
          URL_SCHEME: 'com.simedarbymotors.appauth://',
        },
      },
    },
  },
};

export default configMap[process.env.COUNTRY][process.env.ENV];
