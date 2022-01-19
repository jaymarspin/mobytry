import { Injectable } from '@angular/core';
import { from, Observable, of, Subject, zip } from 'rxjs';
import { Testdrive } from 'src/app/models/common/testdrive.model';
import { Vehicle } from 'src/app/models/common/vehicle.model';
import { ITestdriveApi } from 'src/app/interfaces/testdrive-api.interface';
import { ErrorService } from '../../common/error/error.service';
import { ApiService } from '../../common/api/api.service';
import { ApiMY } from '../api/api-my.service';
import { catchError, mergeMap, map, tap } from 'rxjs/operators';
import { ContactServiceMY } from '../contact-my/contact-my.service';
import { Query } from 'src/app/models/sg/query.model';
import { TdFilterModel } from 'src/app/models/common/filter.model';
import { File, FileEntry } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { TestDriveTNC } from 'src/app/models/common/test-drive-tnc.model';

@Injectable({
  providedIn: 'root',
})
export class TestdriveServiceMY implements ITestdriveApi {
  SF_OBJ = 'Test_Drive__c';

  constructor(
    private errorSrvc: ErrorService,
    private api: ApiService,
    private apiSettings: ApiMY,
    private contactMY: ContactServiceMY,
    private file: File,
    private fileOpener: FileOpener
  ) {}

  getTestdrives(filter: TdFilterModel, oppId?: string, segment?: string): Observable<Testdrive[]> {
    // let query = `${this.query()} WHERE Opportunity__c = '${oppId}'`;
    let query = `${this.query()}`;
    if (filter) {
      query = `${this.query()} WHERE Test_Drive_Status__c LIKE '%${this.getTdFilterStatus(filter.tdStatus)}%'`;
    }
    return this.api.get<Query>(this.apiSettings.getQueryUrl(query)).pipe(
      map((res) => {
        if (!res || !res.records || res.records.length <= 0) {
          return [];
        }
        return res.records.map((tdObj) => {
          return this.fromSF(tdObj);
        });
      }),
      catchError((err) => {
        this.errorSrvc.presentServerErr(err);
        throw err;
      })
    );
  }

  getTestdriveById(testdriveId: string): Observable<Testdrive> {
    if (!testdriveId) {
      throw new Error('Invalid Id.');
    }
    const query = `${this.query()} WHERE Id = '${testdriveId}'`;
    return this.api.get<Query>(this.apiSettings.getQueryUrl(query)).pipe(
      map((res) => {
        if (!res || !res.records || res.records.length <= 0) {
          return [];
        }
        return res.records.map((tdObj) => {
          return this.fromSF(tdObj);
        });
      }),
      map((td: Testdrive[]) => {
        return td && td.length > 0 ? td[0] : null;
      }),
      catchError((err) => {
        this.errorSrvc.presentServerErr(err);
        throw err;
      })
    );
  }

  getVehByRegNo(regNo: string): Observable<Vehicle> {
    if (!regNo) {
      throw new Error('Invalid Id.');
    }
    const query = `SELECT Id FROM Vehicle__c WHERE Registration_No__c = '${regNo}'`;
    return this.api.get<Query>(this.apiSettings.getQueryUrl(query)).pipe(
      map((res) => {
        if (!res || !res.records || res.records.length <= 0) {
          return [];
        }
        return res.records.map((vehObj) => {
          const veh = new Vehicle();
          veh.Id = vehObj.Id;
          return veh;
        });
      }),
      map((veh: Vehicle[]) => {
        return veh && veh.length > 0 ? veh[0] : null;
      }),
      catchError((err) => {
        this.errorSrvc.presentServerErr(err);
        throw err;
      })
    );
  }

  saveSignedPDF(td: Testdrive, pdf: Blob, marketingConsent: boolean, dataConsent: boolean): Observable<Testdrive> {
    console.log('testttttt');
    const url = `${this.api.getAPIUrl('assistant/testdrive/sign')}?testDriveID=${td.Id}&data=${dataConsent ? '1' : '0'}&mktg=${marketingConsent ? '1' : '0'}`;
    return this.api.post<SignTDResp>(url, pdf).pipe(
      mergeMap((res) => this.getTestdriveById(res.tdId)),
      tap((_) => this.getSignedTDPDF(td))
    );
  }

  getSignedTDPDF(td: Testdrive): Observable<FileEntry> {
    const fileSubj = new Subject<FileEntry>();
    this.file
      .checkFile(this.file.cacheDirectory, td.Id)
      .then((_) => {
        from(this.file.resolveDirectoryUrl(this.file.cacheDirectory))
          .pipe(mergeMap((dir) => this.file.getFile(dir, td.Name, { create: false })))
          .subscribe((fileEntry) => {
            fileSubj.next(fileEntry);
          });
      })
      .catch((_) => {
        const req: TDReq = {
          tdReq: new PDFTDReq(),
          action: TDAction.GET_PDF,
        };
        req.tdReq.tdId = td.Id;
        zip(
          from(this.file.resolveDirectoryUrl(this.file.cacheDirectory)).pipe(
            mergeMap((dir) => this.file.getFile(dir, td.Name, { create: true, exclusive: false }))
          ),
          this.api.postBlob(this.api.getAPIUrl('assistant/testdrive/upsert'), req, 'application/pdf')
        ).subscribe(([file, blob]) => {
          file.createWriter((writer) => {
            writer.onwriteend = () => {
              fileSubj.next(file);
            };
            writer.onerror = (e) => fileSubj.error(e);
            writer.write(blob);
          });
        });
      });
    return fileSubj.asObservable();
  }

  getBlankTDPDF(td: Testdrive, marketingConsent: boolean, dataConsent: boolean): Observable<Blob> {
    const req: TDReq = {
      tdReq: new PDFTDReq(),
      action: TDAction.GET_PDF,
    };
    req.tdReq.tdId = td.Id;
    req.tdReq.marketingConsent = marketingConsent;
    req.tdReq.dataConsent = dataConsent;
    return this.api.postBlob(this.api.getAPIUrl('assistant/testdrive/sign'), req, 'application/pdf');
  }

  fromSF(res): Testdrive {
    if (res == null) {
      throw new Error('TD:fromSF:' + JSON.stringify(res));
    }
    const td = new Testdrive();
    td.ContactName = res.Account__r.Name;
    td.CreatedDate = res.CreatedDate;
    td.OpportunityId = res.Opportunity__c;
    td.Id = res.Id;
    td.ContactId = res.Account__c;
    td.SourceName = res.Opportunity__r.Channel__c;
    td.DocNum = res.Account__r.NRIC_Number__c;
    td.DrivingLicense = res.Account__r.NRIC_Number__c;
    td.ExpiryDate = '';
    td.PlannedStartDate = res.Scheduled_Start_DateTime__c;
    const veh = new Vehicle();
    veh.Id = res.Model__c;
    veh.Name = res.Model__r ? res.Model__r.Short_Description__c : '';
    veh.MileageStart = res.Mileage_Recorded_Upon_TD_Creation__c;
    veh.MileageEnd = res.Mileage__c;
    veh.StartTime = res.Vehicle_Out_DateTime__c;
    if (res.Registration_Number__r) {
      veh.Chassis = res.Registration_Number__r.Full_Chassis__c;
      veh.RegNum = res.Registration_Number__r.Registration_Number__c;
      veh.StockId = res.Registration_Number__r.Registration_Number__c;
    }
    veh.Status = this.getTdStatus(res.Test_Drive_Status__c);
    td.Vehicle = veh;
    return td;
  }

  getTdFilterStatus(status: string) {
    switch (status.toLocaleUpperCase()) {
      case 'ALL':
        return '';
      case 'COMPLETED':
        return 'COMPLETED';
      case 'ONGOING':
        return 'VEHICLE OUT';
      case 'UPCOMING':
        return 'SCHEDULED';
      default:
        return '';
    }
  }

  getTdStatus(status: string) {
    switch (status) {
      case 'VEHICLE OUT':
        return 'STARTED';
      case 'COMPLETED':
        return 'COMPLETED';
      case 'CANCELLED':
        return 'CANCELLED';
      case 'SCHEDULED':
        return 'INACTIVE';
      default:
        return 'INACTIVE';
    }
  }

  insertTestdrive(testdrive: Testdrive): Observable<Testdrive> {
    const contact = {
      sfId: testdrive.ContactId,
      docNum: testdrive?.DocNum,
      docType: testdrive.DocType ? this.contactMY.setSFDocType(testdrive.DocType) : null,
    };
    return this.api.post<UpsertResp>(this.apiSettings.getAPIUrl('assistant/customer/upsert'), contact).pipe(
      mergeMap((_) => {
        const td = {
          tdReq: new InsTDReq(),
          action: TDAction.INSERT,
        };
        td.tdReq.oppId = testdrive.OpportunityId;
        td.tdReq.modelId = testdrive.Vehicle.Id;
        td.tdReq.scheduledTime = new Date(testdrive.PlannedStartDate);
        return this.api.post<TDResp>(this.api.getAPIUrl('assistant/testdrive/upsert'), td).pipe(
          tap((e) => {
            console.log(e);
          }),
          mergeMap((e) => {
            return this.getTestdriveById(e.tdId);
          })
        );
      }),
      catchError((err) => {
        this.errorSrvc.presentServerErr(err);
        throw err;
      })
    );
  }

  startTestdrive(testdrive: Testdrive): Observable<Testdrive> {
    const contact = {
      sfId: testdrive.ContactId,
      docNum: testdrive?.DocNum,
      docType: testdrive.DocType ? this.contactMY.setSFDocType(testdrive.DocType) : null,
    };
    return this.api.post<UpsertResp>(this.apiSettings.getAPIUrl('assistant/customer/upsert'), contact).pipe(
      mergeMap((_) => {
        const td = {
          tdReq: new InsTDReq(),
          action: TDAction.INSERT,
        };
        td.tdReq.oppId = testdrive.OpportunityId;
        // td.tdReq.modelId = testdrive.Vehicle.Id;
        td.tdReq.scheduledTime = new Date(testdrive.PlannedStartDate);
        return this.api.post<TDResp>(this.api.getAPIUrl('assistant/testdrive/upsert'), td).pipe(
          mergeMap((e) => {
            return this.getTestdriveById(e.tdId);
          })
        );
      }),
      catchError((err) => {
        this.errorSrvc.presentServerErr(err);
        throw err;
      })
    );
  }

  endTestdrive(testdrive: Testdrive): Observable<Testdrive> {
    const contact = {
      sfId: testdrive.ContactId,
      docNum: testdrive?.DocNum,
      docType: testdrive.DocType ? this.contactMY.setSFDocType(testdrive.DocType) : null,
    };
    return this.api.post<UpsertResp>(this.apiSettings.getAPIUrl('assistant/customer/upsert'), contact).pipe(
      mergeMap((_) => {
        const td = {
          tdReq: new InsTDReq(),
          action: TDAction.INSERT,
        };
        td.tdReq.oppId = testdrive.OpportunityId;
        // td.tdReq.modelId = testdrive.Vehicle.Id;
        td.tdReq.scheduledTime = new Date(testdrive.PlannedStartDate);
        return this.api.post<TDResp>(this.api.getAPIUrl('assistant/testdrive/upsert'), td).pipe(
          tap((e) => {
            console.log(e);
          }),
          mergeMap((e) => {
            return this.getTestdriveById(e.tdId);
          })
        );
      }),
      catchError((err) => {
        this.errorSrvc.presentServerErr(err);
        throw err;
      })
    );
  }

  query() {
    return (
      'SELECT Id, Account__c, Account__r.Name, Account__r.Doc_Type__c, Account__r.NRIC_Number__c, Opportunity__c, Model__c, Model__r.Short_Description__c, Registration_Number__c, Mileage__c, Remarks__c, ' +
      'Registration_Number__r.Name, Opportunity__r.Channel__c, Registration_Number__r.Full_Chassis__c, Registration_Number__r.Registration_Number__c, Trade_Plate_Number__c, ' +
      'Registration_Number__r.Vehicle_Model__r.Short_Description__c, Test_Drive_Status__c, CreatedDate, Entered_Group_DateTime__c, ' +
      'Cancellation_DateTime__c, Vehicle_Out_DateTime__c, Vehicle_In_DateTime__c, Mileage_Recorded_Upon_TD_Creation__c, Scheduled_Start_DateTime__c, ' +
      `Indemnity_Source__c, CreatedBy.Alias, CreatedBy.MobilePhone, CreatedBy.Name, CreatedById, Name FROM ${this.SF_OBJ} `
    );
  }

  getTDModels(cmpFilter: Set<string>) {
    const query =
      "SELECT Id, Vehicle__r.Vehicle_Model__r.Name, Sharing_Rule_Company__c FROM Vehicle_Fleet_Master__c WHERE Fleet_Type__c = 'DEMO' " +
      "AND Fleet_End_Date__c = null AND Vehicle__r.Vehicle_Type__r.Name IN ('NC','UC') AND Vehicle__r.Vehicle_Model__c != NULL " +
      `AND Vehicle__r.Vehicle_Model__r.Series_Picklist__c != NULL AND Sharing_Rule_Company__c IN ('${Array.from(cmpFilter).join(`','`)}')`;
    return this.api.get<Query>(this.apiSettings.getQueryUrl(query)).pipe(
      map((res) => {
        console.log(res);
        if (!res || !res.records || res.records.length <= 0) {
          return [];
        }
        return res.records.map((vehObj) => {
          return vehObj;
        });
      }),
      catchError((err) => {
        this.errorSrvc.presentServerErr(err);
        throw err;
      })
    );
  }

  getTNCTerms(td: Testdrive): Observable<TestDriveTNC> {
    const req: TDReq = {
      tdReq: new TNCTDReq(),
      action: TDAction.GET_TNC,
    };
    req.tdReq.tdId = td.Id;
    return this.api.post<TestDriveTNC>(this.api.getAPIUrl('assistant/testdrive/upsert'), req).pipe(
      map((terms) => {
        if (!terms.marketingConsent || !terms.dataConsent || !terms.pdpaTerms || !terms.tdTerms) {
          throw new Error('Incomplete terms. Contact administrator.');
        } else {
          return terms;
        }
      })
    );
  }
}

enum TDAction {
  INSERT = 'INSERT',
  VEH_IN = 'VEH_IN',
  VEH_OUT = 'VEH_OUT',
  CANCEL = 'CANCEL',
  GET_PDF = 'GET_PDF',
  GET_TNC = 'GET_TNC',
}

class TDReq {
  tdReq: any;
  action: TDAction;
}

class AssistantApiRes {
  public err;
}

class TDResp extends AssistantApiRes {
  tdId: string;
}

class InsTDReq {
  oppId: string;
  modelId: string;
  groupedTime: Date;
  scheduledTime: Date;
}
class TDCancelReq {
  tdId: string;
  cancelDT: Date;
}

class UpsertResp {
  custId: string;
  err: string;
}

class PDFTDReq {
  tdId: string;
  marketingConsent: boolean;
  dataConsent: boolean;
}

class SignTDResp extends AssistantApiRes {
  tdId: string;
  attId: string;
}

class TNCTDReq {
  tdId: string;
}
