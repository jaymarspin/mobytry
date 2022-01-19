import { Observable } from 'rxjs';
import { Testdrive } from '../models/common/testdrive.model';
import { TdFilterModel } from '../models/common/filter.model';
import { TestDriveTNC } from '../models/common/test-drive-tnc.model';
import { Vehicle } from '../models/common/vehicle.model';
import { FileEntry } from '@ionic-native/file/ngx';

export interface ITestdriveApi {
  getTestdrives(filter: TdFilterModel, oppId?: string, segment?: string): Observable<Testdrive[]>;
  getTestdriveById(testdriveId: string): Observable<Testdrive>;
  insertTestdrive(testdrive: Testdrive): Observable<Testdrive>;
  startTestdrive(testdrive: Testdrive): Observable<Testdrive>;
  endTestdrive(testdrive: Testdrive): Observable<Testdrive>;
  getTDModels(cmpFilter: Set<string>);
  saveSignedPDF(td: Testdrive, pdf: Blob, marketingConsent: boolean, dataConsent: boolean): Observable<Testdrive>;
  getSignedTDPDF(td: Testdrive): Observable<FileEntry>;
  getBlankTDPDF(td: Testdrive, marketingConsent: boolean, dataConsent: boolean): Observable<Blob>;
  getTNCTerms(td: Testdrive): Observable<TestDriveTNC>;
  getVehByRegNo(regNo: string): Observable<Vehicle>;
}
