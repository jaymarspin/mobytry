import { Injectable, Inject } from '@angular/core';
import { TESTDRIVE_SERVICE_KEY } from 'src/app/service-providers/dynamic-key.provider';
import { ITestdriveApi } from 'src/app/interfaces/testdrive-api.interface';
import { Testdrive } from 'src/app/models/common/testdrive.model';
import { Observable } from 'rxjs';
import { ErrorService } from '../error/error.service';
import { TdFilterModel } from 'src/app/models/common/filter.model';
import { TestDriveTNC } from 'src/app/models/common/test-drive-tnc.model';
import { TestdriveMeta } from 'src/app/models/common/testdrive-meta.model';
import { TESTDRIVE_META_KEY } from 'src/app/service-providers/testdrive-meta.provider';
import { Vehicle } from 'src/app/models/common/vehicle.model';
import { FileEntry } from '@ionic-native/file/ngx';

@Injectable({
  providedIn: 'root',
})
export class CommonTestdriveService {
  constructor(
    @Inject(TESTDRIVE_SERVICE_KEY) private testdriveAPI: ITestdriveApi,
    private errorSrvc: ErrorService,
    @Inject(TESTDRIVE_META_KEY) private testdriveMetaParam: TestdriveMeta
  ) {}

  getTestdrives(filter: TdFilterModel, oppId?: string, segment?: string): Observable<Testdrive[]> {
    const id = oppId ? oppId : '';
    try {
      return this.testdriveAPI.getTestdrives(filter, id, segment);
    } catch (e) {
      this.errorSrvc.presentServerErr(e);
    }
  }

  getTestdrivesById(testdriveId: string): Observable<Testdrive> {
    try {
      if (testdriveId && testdriveId.trim()) {
        return this.testdriveAPI.getTestdriveById(testdriveId);
      }
    } catch (e) {
      this.errorSrvc.presentServerErr(e);
    }
  }

  getVehByRegNo(regNo: string): Observable<Vehicle> {
    try {
      if (regNo && regNo.trim()) {
        return this.testdriveAPI.getVehByRegNo(regNo);
      }
    } catch (e) {
      this.errorSrvc.presentServerErr(e);
    }
  }

  insertTestdrive(testdrive: Testdrive): Observable<Testdrive> {
    try {
      return this.testdriveAPI.insertTestdrive(testdrive);
    } catch (e) {
      this.errorSrvc.presentServerErr(e);
    }
  }

  startTestdrive(testdrive: Testdrive): Observable<Testdrive> {
    try {
      return this.testdriveAPI.startTestdrive(testdrive);
    } catch (e) {
      this.errorSrvc.presentServerErr(e);
    }
  }

  endTestdrive(testdrive: Testdrive): Observable<Testdrive> {
    try {
      return this.testdriveAPI.endTestdrive(testdrive);
    } catch (e) {
      this.errorSrvc.presentServerErr(e);
    }
  }

  getTdModels(cmpFilter: Set<string>) {
    try {
      return this.testdriveAPI.getTDModels(cmpFilter);
    } catch (e) {
      this.errorSrvc.presentServerErr(e);
    }
  }

  saveSignedPDF(td: Testdrive, pdf: Blob, marketingConsent: boolean, dataConsent: boolean): Observable<Testdrive> {
    try {
      return this.testdriveAPI.saveSignedPDF(td, pdf, marketingConsent, dataConsent);
    } catch (e) {
      this.errorSrvc.presentServerErr(e);
    }
  }

  getSignedTDPDF(td: Testdrive): Observable<FileEntry> {
    try {
      return this.testdriveAPI.getSignedTDPDF(td);
    } catch (e) {
      this.errorSrvc.presentServerErr(e);
    }
  }

  getBlankTDPDF(td: Testdrive, marketingConsent: boolean, dataConsent: boolean): Observable<Blob> {
    try {
      return this.testdriveAPI.getBlankTDPDF(td, marketingConsent, dataConsent);
    } catch (e) {
      this.errorSrvc.presentServerErr(e);
    }
  }

  getTNCTerms(td: Testdrive): Observable<TestDriveTNC> {
    try {
      return this.testdriveAPI.getTNCTerms(td);
    } catch (e) {
      this.errorSrvc.presentServerErr(e);
    }
  }
}
