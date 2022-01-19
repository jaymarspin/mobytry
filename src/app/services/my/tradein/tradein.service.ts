import { Injectable } from '@angular/core';
import { ITradeinApi } from 'src/app/interfaces/tradein-api.interface';
import { Observable, of } from 'rxjs';
import { TradeIn, Quotation, Purchaser } from 'src/app/models/common/tradein.model';
import { TradeInFilterModel } from 'src/app/models/common/filter.model';
import { SelectOption } from 'src/app/models/common/select-option.model';
import { map, catchError, mergeMap } from 'rxjs/operators';
import { ErrorService } from '../../common/error/error.service';
import { ApiService } from '../../common/api/api.service';
import { ApiMY } from '../api/api-my.service';
import { Query } from 'src/app/models/sg/query.model';
import { User } from 'src/app/models/common/user.model';
import { AuthenticationService } from '../../common/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class TradeinServiceMY implements ITradeinApi {
  SF_OBJ = 'Test_Drive__c';
  private user: User;

  constructor(private errorSrvc: ErrorService, private api: ApiService, private apiSettings: ApiMY, private auth: AuthenticationService) {
    this.auth.subUser().subscribe((u) => {
      this.user = u;
      console.log(this.user);
    });
  }

  getTradeIns(filter: TradeInFilterModel, tradeInId?: string, oppId?: string): Observable<TradeIn[]> {
    let query = `${this.query()}`;
    if (oppId) {
      query = `${query} WHERE Opportunity__c = '${oppId}'`;
    }
    query = `${query} ORDER BY CreatedDate`;
    return this.api.get<Query>(this.apiSettings.getQueryUrl(query)).pipe(
      map((res) => {
        console.log(res);
        if (!res || !res.records || res.records.length <= 0) {
          return [];
        }
        return res.records.map((oppObj) => {
          return this.fromSF(oppObj);
        });
      }),
      catchError((err) => {
        this.errorSrvc.presentServerErr(err);
        throw err;
      })
    );
    // const vehId = [0, 1, 2];
    // return of(
    //   vehId.map((i) => {
    //     const td = new TradeIn();
    //     td.Id = i.toString();
    //     td.ContactId = i.toString();
    //     td.OpportunityId = i.toString();
    //     td.CreatedDate = new Date().toString();
    //     td.ContactName = 'Ronald Robertson';
    //     td.SourceName = 'Referral Programme';
    //     td.DocNum = 'TEST';
    //     td.Mobile = '+6501254';
    //     td.Email = 'test@email.com';
    //     td.Address = 'Malaysia';
    //     td.RegNo = 'R12312312';
    //     td.Chassis = 'C12312312';
    //     td.RegDate = new Date().toString();
    //     td.YearMake = '2014';
    //     td.Make = '1';
    //     td.Model = 'Test';
    //     td.Variant = 'Test';
    //     td.Mileage = '21654';
    //     td.Color = 'Red';
    //     td.TradeInSource = 'Referral Programme';
    //     td.Purchaser = 'Dominique Kevin Macasero';
    //     td.Warranty = new Date().toString();
    //     td.Notes = 'TESTING REMARK';
    //     td.ExpectedPrice = 1000;
    //     td.Overtrade = 1000;
    //     return td;
    //   })
    // );
  }

  fromSF(res) {
    const td = new TradeIn();
    return td;
  }

  upsertTradeIn(tradeIn: TradeIn): Observable<TradeIn[]> {
    const req = {
      requester: {
        salesOppId: tradeIn.OpportunityId,
        scId: this.user.userId,
      },
      registrationNum: tradeIn?.RegNo,
      mileage: tradeIn.Mileage,
      remarks: tradeIn?.Notes,
      company: '05',
      purchaserId: tradeIn.Purchaser,
      carOwnerId: tradeIn?.ContactId,
    };
    return this.api.post<UpsertResp>(this.apiSettings.getAPIUrl('moby/opp/quote/request'), req).pipe(
      mergeMap((res) => this.getTradeIns(undefined, undefined, res.purchaseOppId)),
      catchError((err) => {
        this.errorSrvc.presentServerErr(err);
        throw err;
      })
    );
  }

  getMakes(): Observable<SelectOption[]> {
    throw new Error('Method not implemented.');
  }

  getPurchasers(): Observable<Purchaser[]> {
    throw new Error('Method not implemented.');
  }

  getSources(): Observable<SelectOption[]> {
    throw new Error('Method not implemented.');
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
}

class UpsertResp {
  purchaseOppId: string;
  err: string;
}
