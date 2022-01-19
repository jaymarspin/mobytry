import { HttpBackend, HttpClient, HttpClientModule, HttpXhrBackend, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy } from '@angular/router';
import { ScreenOrientation } from '@ionic-enterprise/screen-orientation/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { Contacts } from '@ionic-native/contacts/ngx';
import { Device } from '@ionic-native/device/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File } from '@ionic-native/file/ngx';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { QRScanner } from '@ionic-native/qr-scanner/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicModule, IonicRouteStrategy, Platform } from '@ionic/angular';
import { Drivers } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/storage-angular';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
// Imported Ionic Native Modules
import { NativeHttpBackend, NativeHttpFallback, NativeHttpModule } from 'ionic-native-http-connection-backend';
import { NgCalendarModule } from 'ionic2-calendar';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SplashScreenComponentModule } from './components/common/splash-screen/splash-screen.module';
import { MY_PROVIDERS } from './service-providers/app-my-module.provider';
import { SG_PROVIDERS } from './service-providers/app-sg-module.provider';
import { AUTH_PARAM_KEY, getAuthParam } from './service-providers/auth-param.provider';
import { CONTACT_META_KEY, getContactMeta } from './service-providers/contact-meta.provider';
import { EVENT_META_KEY, getEventMeta } from './service-providers/event-meta.provider';
import { getOpportunityMeta, OPPORTUNITY_META_KEY } from './service-providers/opportunity-meta.provider';
import { getTaskMeta, TASK_META_KEY } from './service-providers/task-meta.provider';
import { getTestdriveMeta, TESTDRIVE_META_KEY } from './service-providers/testdrive-meta.provider';
import { ApiService } from './services/common/api/api.service';
import { AuthenticationService } from './services/common/auth/auth.service';
import { ErrorService } from './services/common/error/error.service';
// Common Services
import { MenuService } from './services/common/menu/menu.service';
import { NotificationService } from './services/common/notification/notification.service';
import { PDFSignService } from './services/common/pdf-sign/pdfsign.service';
import { CommonTestdriveService } from './services/common/testdrive/testdrive.service';
import './util/filereader.util';
import { LoggingInterceptor } from './util/logging-interceptor.util';
import { RollbarService, rollbarFactory, RollbarErrorHandler } from './services/common/rollbar/rollbar';
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [
        BrowserModule,
        IonicModule.forRoot({ scrollPadding: false, scrollAssist: true }),
        AppRoutingModule,
        BrowserAnimationsModule,
        NativeHttpModule,
        SplashScreenComponentModule,
        HttpClientModule,
        NgCalendarModule,
        IonicStorageModule.forRoot({
            name: '__mydb',
            driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage],
        }),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient],
            },
        }),
    ],
    providers: [
        FingerprintAIO,
        File,
        FileOpener,
        AppVersion,
        StatusBar,
        Device,
        HTTP,
        Contacts,
        ErrorService,
        ApiService,
        NotificationService,
        AuthenticationService,
        MenuService,
        PDFSignService,
        CommonTestdriveService,
        ScreenOrientation,
        QRScanner,
        { provide: HTTP_INTERCEPTORS, useClass: LoggingInterceptor, multi: true },
        {
            provide: HttpBackend,
            useClass: NativeHttpFallback,
            deps: [Platform, NativeHttpBackend, HttpXhrBackend],
        },
        { provide: ErrorHandler, useClass: RollbarErrorHandler }, 
        { provide: RollbarService, useFactory: rollbarFactory },
        { provide: AUTH_PARAM_KEY, useValue: getAuthParam() },
        { provide: CONTACT_META_KEY, useValue: getContactMeta() },
        { provide: OPPORTUNITY_META_KEY, useValue: getOpportunityMeta() },
        { provide: TASK_META_KEY, useValue: getTaskMeta() },
        { provide: EVENT_META_KEY, useValue: getEventMeta() },
        { provide: TESTDRIVE_META_KEY, useValue: getTestdriveMeta() },
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        { provide: ErrorHandler, useClass: ErrorService },
        ...SG_PROVIDERS,
        ...MY_PROVIDERS,
    ],
    bootstrap: [AppComponent],
})
export class AppModule { }
