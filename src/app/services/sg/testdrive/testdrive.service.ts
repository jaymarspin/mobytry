import { Injectable } from '@angular/core';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File, FileEntry } from '@ionic-native/file/ngx';
import * as moment from 'moment';
import { from, Observable, Subject, zip } from 'rxjs';
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { ITestdriveApi } from 'src/app/interfaces/testdrive-api.interface';
import { TdFilterModel } from 'src/app/models/common/filter.model';
import { TestDriveTNC } from 'src/app/models/common/test-drive-tnc.model';
import { Testdrive } from 'src/app/models/common/testdrive.model';
import { User } from 'src/app/models/common/user.model';
import { VehicleModel } from 'src/app/models/common/vehicle-model.model';
import { Vehicle } from 'src/app/models/common/vehicle.model';
import { Query } from 'src/app/models/sg/query.model';
import { ApiService } from '../../common/api/api.service';
import { AuthenticationService } from '../../common/auth/auth.service';
import { ErrorService } from '../../common/error/error.service';
import { CommonUserService } from '../../common/user/user.service';
import { ApiSG } from '../api/api-sg.service';
import { ContactServiceSG } from '../contact-sg/contact-sg.service';
@Injectable({
  providedIn: 'root',
})
export class TestdriveServiceSG implements ITestdriveApi {
  SF_OBJ = 'Test_Drive__c';
  User: User;
  constructor(
    private errorSrvc: ErrorService,
    private api: ApiService,
    private apiSettings: ApiSG,
    private contactSG: ContactServiceSG,
    private file: File,
    private fileOpener: FileOpener,
    private auth: AuthenticationService,
    private userService: CommonUserService
  ) {
    this.auth.subUser().subscribe((user) => (this.User = user));
  }

  getTestdrives(filter: TdFilterModel, oppId?: string, segment?: string): Observable<Testdrive[]> {
    console.log(oppId);
    console.log(segment);
    let query = `${this.query()} WHERE Test_Drive_Status__c NOT IN ('CANCELLED', 'COMPLETED') AND Extended_Test_Drive__c = FALSE
                 AND Company__r.Name IN ('02', '888')`;
    if (oppId) {
      query += ` AND Opportunity__c = '${oppId}'`;
    }

    if (segment === 'alltestdrive') {
      query += ' AND Opportunity__c != NULL';
    } else if (segment === 'mytestdrive') {
      query += ` AND Opportunity__r.Sales_Rep_Name__c = '${this.User.userId}'`;
    }
    query += ' ORDER BY CreatedDate DESC LIMIT 50';

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
    const query = `SELECT Id, Vehicle_Model_Description__c, Running_Mileage__c, Registration_Number__c FROM Vehicle__c WHERE Registration_Number__c = '${regNo}'`;
    return this.api.get<Query>(this.apiSettings.getQueryUrl(query)).pipe(
      map((res) => {
        if (!res || !res.records || res.records.length <= 0) {
          return [];
        }
        return res.records.map((vehObj) => {
          const veh = new Vehicle();
          veh.Id = vehObj.Id;
          veh.ShortDesc = vehObj.Vehicle_Model_Description__c;
          veh.MileageStart = vehObj.Running_Mileage__c;
          veh.RegNum = vehObj.Registration_Number__c;
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

  retrieveTDModels(cmpFilter: Set<string>, useCache = true): Observable<VehicleModel[]> {
    const tdVehQuery =
      `SELECT Id, Vehicle__r.Vehicle_Model__r.Name, Sharing_Rule_Company__c FROM Vehicle_Fleet_Master__c WHERE Fleet_Type__c = 'DEMO' ` +
      `AND Fleet_End_Date__c = null AND Vehicle__r.Vehicle_Type__r.Name IN ('NC','UC') AND Vehicle__r.Vehicle_Model__c != NULL ` +
      `AND Vehicle__r.Vehicle_Model__r.Series_Picklist__c != NULL AND Sharing_Rule_Company__c IN ('${Array.from(cmpFilter).join(`','`)}')`;
    const modelCmpMap = new Map<string, string>();
    return this.api.get<Query>(this.apiSettings.getQueryUrl(tdVehQuery)).pipe(
      switchMap((res) => {
        const cmpModelMap = new Map<string, Set<string>>();
        res.records.forEach((vsm) => {
          modelCmpMap.set(vsm.Vehicle__r.Vehicle_Model__r.Name, vsm.Sharing_Rule_Company__c);
          let cmpModels = cmpModelMap.get(vsm.Sharing_Rule_Company__c);
          cmpModels = cmpModels ? cmpModels : new Set<string>();
          cmpModels.add(vsm.Vehicle__r.Vehicle_Model__r.Name);
          cmpModelMap.set(vsm.Sharing_Rule_Company__c, cmpModels);
        });
        const queryCmpArr = [];
        cmpModelMap.forEach((val, key) => {
          queryCmpArr.push(`(Company__r.Name = '${key}' AND Name IN ('${Array.from(val).join("','")}'))`);
        });
        console.log(`res: ${JSON.stringify(res)}, cmpModelMap:${JSON.stringify(cmpModelMap)}, queryCmpArr:${JSON.stringify(queryCmpArr)}`);
        const query =
          `SELECT Id, Name, Description__c, Short_Description__c, Series_Picklist__c, Vehicle_Type__r.Id, Vehicle_Type__r.Name,` +
          `Company__r.Id, Company__r.Name, Vehicle_Make__r.Name FROM Vehicle_Model__c WHERE Vehicle_Type__r.Name = 'NC' AND ` +
          `${queryCmpArr.join(' OR ')} ORDER BY Series_Picklist__c ASC`;
        return this.api.get<Query>(this.apiSettings.getQueryUrl(query)).pipe(
          map((modelRes) =>
            modelRes.records.map((res) => {
              const vehModelObj = new VehicleModel();
              vehModelObj.Name = res.Name;
              vehModelObj.Description = res.Desciption__c;
              vehModelObj.Id = res.Id;
              vehModelObj.ShortDescription = res.Short_Description__c;
              vehModelObj.SeriesPicklist = res.Series_Picklist__c;
              vehModelObj.VehMake = res.Vehicle_Make__r.Name;
              vehModelObj.VehType = res.Vehicle_Type__r.Name;
              vehModelObj.Company = res.Company__r.Name;
              return vehModelObj;
            })
          )
        );
      }),
      map((modelList) => {
        const seenModels: { [key: string]: VehicleModel } = {};
        modelList.forEach((vehModel) => {
          const cmp = modelCmpMap.get(vehModel.Name);
          if (!cmp || cmp !== vehModel.Company) {
            return;
          }
          seenModels[vehModel.Name] = vehModel;
        });
        return Object.values(seenModels);
      })
    );
  }

  getBlankTDPDF(td: Testdrive, marketingConsent: boolean, dataConsent: boolean): Observable<Blob> {
    const req: TDReq = {
      tdReq: new PDFTDReq(),
      action: TDAction.GET_PDF,
    };
    req.tdReq.tdId = td.Id;
    req.tdReq.marketingConsent = marketingConsent;
    req.tdReq.dataConsent = dataConsent;
    console.log(req);
    return this.api.postBlob(this.api.getAPIUrl('assistant/testdrive/upsert'), req, 'application/json');
  }

  saveSignedPDF(td: Testdrive, pdf: Blob, marketingConsent: boolean, dataConsent: boolean): Observable<Testdrive> {
    const reader = new FileReader();
    let base64data;
    const readerSubj = new Subject();
    reader.onloadend = () => {
      try {
        base64data = reader.result;
        console.log(base64data);
        readerSubj.next(base64data);
        readerSubj.complete();
      } catch (err) {
        readerSubj.error(err);
      }
    };

    const url = `${this.api.getAPIUrl('assistant/testdrive/sign')}?base64=true&testDriveID=${td.Id}&data=${dataConsent ? '1' : '0'}&mktg=${
      marketingConsent ? '1' : '0'
    }`;
    const obsRes = readerSubj.asObservable().pipe(
      mergeMap((base64data) => {
        return this.api.post<SignTDResp>(url, base64data, 'text/plain');
      }),
      mergeMap((res) => this.getTestdriveById(res.tdId)),
      tap((_) => this.getSignedTDPDF(td))
    );
    reader.readAsDataURL(pdf);
    return obsRes;
  }

  getSignedTDPDF(td: Testdrive): Observable<FileEntry> {
    const res = new Subject<[FileEntry, string]>();
    zip(
      from(this.file.resolveDirectoryUrl(this.file.cacheDirectory)).pipe(
        mergeMap((dir) =>
          this.file.getFile(dir, `Test_Drive_Signed.pdf`, {
            create: true,
            exclusive: false,
          })
        )
      ),
      this.getBlankTDPDF(td, true, true)
    ).subscribe(([file, blob]) => {
      file.createWriter((writer) => {
        writer.onwriteend = () => {
          res.next([file, blob.type]);
          res.complete();
        };
        writer.onerror = (e) => {
          res.error(e);
        };
        writer.write(blob);
      });
    });
    return res.asObservable().pipe(
      map(([file, type]) => {
        // from(this.fileOpener.open(file.toURL(), type)).subscribe(
        //   () => { },
        //   (err) => {
        //     this.errorSrvc.presentServerErr(err);
        //     throw err;
        //   }
        // );
        return file;
      })
    );
  }

  fromSF(res): Testdrive {
    // console.log(res)
    console.log(res);
    if (res == null) {
      throw new Error('TD:fromSF:' + JSON.stringify(res));
    }
    const td = new Testdrive();
    td.ContactName = res.Account__r.Name;
    td.CreatedDate = res.CreatedDate;
    td.OpportunityId = res.Opportunity__c;
    td.Id = res.Id;
    td.ContactId = res.Account__c;
    td.SourceName = res.Opportunity__r?.Channel__c;
    td.DocNum = res.Account__r.NRIC_Number__c;
    td.DrivingLicense = res.Account__r.NRIC_Number__c;
    td.ExpiryDate = '';
    td.PlannedStartDate = res.Scheduled_Start_DateTime__c;
    td.IsSigned = res.Indemnity_Source__c === 'Indemnity Form';
    td.Status = res.Test_Drive_Status__c;
    const veh = new Vehicle();
    veh.Id = res.Model__c;
    // veh.Name = res.Model__r ? res.Model__r.Short_Description__c : '';
    veh.MileageStart = res.Mileage_Recorded_Upon_TD_Creation__c;
    veh.MileageEnd = res.Mileage__c;
    veh.StartTime = res.Vehicle_Out_DateTime__c;
    // veh.Name = res.Registration_Number__r.Vehicle_Model__r.Short_Description__c ?? "";
    // const x = JSON.parse(JSON.stringify(res.Registration_Number__r))

    // if(res.Registration_Number__r.Vehicle_Model__r){
    //   // veh.Name = x.Vehicle_Model__r.Short_Description__c
    //   console.log(res.Registration_Number__r.Vehicle_Model__r)
    // }
    if (res.Registration_Number__r) {
      veh.Chassis = res.Registration_Number__r.Full_Chassis__c;
      veh.RegNum = res.Registration_Number__r.Registration_Number__c;
      veh.StockId = res.Registration_Number__r.Registration_Number__c;
      veh.Name = res.Registration_Number__r.Vehicle_Model__r ? res.Registration_Number__r.Vehicle_Model__r.Short_Description__c : '';
    } else if (res.Model__r) {
      veh.Name = res.Model__r.Short_Description__c;
    }
    veh.Status = res.Test_Drive_Status__c;
    veh.Notes = res.Remarks__c;
    td.Vehicle = veh;
    td.SalesRep = res.Opportunity__r?.Sales_Rep_Name__r?.Name;
    return td;
  }

  insertTestdrive(testdrive: Testdrive): Observable<Testdrive> {
    return this.contactSG.setContact(testdrive.Contact).pipe(
      mergeMap((_) => {
        const td = {
          tdReq: new InsTDReq(),
          action: TDAction.INSERT,
        };
        td.tdReq.oppId = testdrive.OpportunityId;
        td.tdReq.modelId = testdrive.ModelId;
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
    const td = {
      tdReq: new VehOutTDReq(),
      action: TDAction.VEH_OUT,
    };
    td.tdReq.tdId = testdrive.Id;
    td.tdReq.vehId = testdrive.Vehicle.Id;
    td.tdReq.tradePlate = testdrive.TradePlate;
    td.tdReq.startMileage = testdrive.Vehicle.MileageStart;
    td.tdReq.startTime = moment().toDate();
    return this.api.post<TDResp>(this.api.getAPIUrl('assistant/testdrive/upsert'), td).pipe(
      mergeMap((e) => {
        return this.getTestdriveById(e.tdId);
      })
    );
  }

  endTestdrive(testdrive: Testdrive): Observable<Testdrive> {
    const td = {
      tdReq: new VehInTDReq(),
      action: TDAction.VEH_IN,
    };
    td.tdReq.tdId = testdrive.Id;
    td.tdReq.remarks = testdrive.Vehicle.Notes;
    td.tdReq.mileage = testdrive.Vehicle.MileageEnd;
    td.tdReq.endTime = moment().toDate();
    return this.api.post<TDResp>(this.api.getAPIUrl('assistant/testdrive/upsert'), td).pipe(
      mergeMap((e) => {
        return this.getTestdriveById(e.tdId);
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

  query() {
    return (
      'SELECT Id, opportunity__r.Sales_Rep_Name__r.Name, Account__c, Account__r.Name, Account__r.Doc_Type__c, Account__r.NRIC_Number__c, Opportunity__c, Model__c, Model__r.Short_Description__c, Registration_Number__c, Mileage__c, Remarks__c, ' +
      'Registration_Number__r.Name, Opportunity__r.Channel__c, Registration_Number__r.Full_Chassis__c, Registration_Number__r.Registration_Number__c, Trade_Plate_Number__c, ' +
      'Registration_Number__r.Vehicle_Model__r.Short_Description__c, Test_Drive_Status__c, CreatedDate, Entered_Group_DateTime__c, ' +
      'Cancellation_DateTime__c, Vehicle_Out_DateTime__c, Vehicle_In_DateTime__c, Mileage_Recorded_Upon_TD_Creation__c, Scheduled_Start_DateTime__c, ' +
      `Indemnity_Source__c, CreatedBy.Alias, CreatedBy.MobilePhone, CreatedBy.Name, CreatedById, Name FROM ${this.SF_OBJ} `
    );
  }

  getTDModels(cmpFilter: Set<string>) {
    const query =
      `SELECT Id, Vehicle__r.Vehicle_Model__r.Name, Sharing_Rule_Company__c FROM Vehicle_Fleet_Master__c WHERE Fleet_Type__c = 'DEMO' ` +
      `AND Fleet_End_Date__c = null AND Vehicle__r.Vehicle_Type__r.Name IN ('NC','UC') AND Vehicle__r.Vehicle_Model__c != NULL ` +
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

class VehOutTDReq {
  tdId: string;
  vehId: string;
  tradePlate: string;
  startMileage: string;
  startTime: Date;
}

class VehInTDReq {
  tdId: string;
  custEmail: string;
  custMobile: string;
  remarks: string;
  mileage: string;
  endTime: Date;
}
