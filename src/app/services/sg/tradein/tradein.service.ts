import { Injectable } from '@angular/core';
import { ITradeinApi } from 'src/app/interfaces/tradein-api.interface';
import { Observable, of } from 'rxjs';
import { Purchaser, TradeIn } from 'src/app/models/common/tradein.model';
import { TradeInFilterModel } from 'src/app/models/common/filter.model';
import { User } from 'src/app/models/common/user.model';
import { ErrorService } from '../../common/error/error.service';
import { ApiService } from '../../common/api/api.service';
import { ApiSG } from '../../sg/api/api-sg.service';
import { AuthenticationService } from '../../common/auth/auth.service';
import { map, catchError, mergeMap } from 'rxjs/operators';
import { SelectOption } from 'src/app/models/common/select-option.model';
import { Query } from 'src/app/models/sg/query.model';
import { testUserAgent } from '@ionic/core/dist/types/utils/platform';

@Injectable({
  providedIn: 'root',
})
export class TradeinServiceSG implements ITradeinApi {
  SF_OBJ = 'Opportunity';
  private user: User;

  constructor(private errorSrvc: ErrorService, private api: ApiService, private apiSettings: ApiSG, private auth: AuthenticationService) {
    this.auth.subUser().subscribe((u) => {
      this.user = u;
      console.log(this.user);
    });
  }

  getTradeIns(filter: TradeInFilterModel, tradeInId?: string, oppId?: string): Observable<TradeIn[]> {
    let query =
      `SELECT Id, Related_Opportunity__c, Related_Opportunity__r.Registration_Num_Purchase__c, Related_Opportunity__r.Chassis__r.Name, Request_Time__c,` +
      ` Created_From__c, Request_To__r.Name, Related_Opportunity__r.AccountId, Related_Opportunity__r.Account.Name,` +
      ` Related_Opportunity__r.Account.NRIC_Number__c, Related_Opportunity__r.Account.Mobile_Preferred__pc,` +
      ` Related_Opportunity__r.Account.Default_Email__c, Related_Opportunity__r.Chassis__r.Vehicle_Make__r.Name,` +
      ` Related_Opportunity__r.Chassis__r.Vehicle_Model__r.Name, Related_Opportunity__r.Remarks__c, Related_Opportunity__r.StageName` +
      ` FROM Request__c WHERE User__c = '${this.user.userId}' AND Type__c = 'Trade In'`;
    console.log(tradeInId);
    console.log(oppId);
    if (tradeInId) {
      query += ` AND Id = '${tradeInId}'`;
    }
    if (oppId) {
      query += ` AND (Opportunity__c = '${oppId}' OR Related_Opportunity__c = '${oppId}')`;
    }
    query += ' ORDER BY Request_Time__c DESC LIMIT 50';
    console.log(query);
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
  }

  fromSF(res) {
    const trade = new TradeIn();
    trade.Id = res.Id;
    trade.ContactId = res.Related_Opportunity__r.AccountId;
    trade.OpportunityId = res.Related_Opportunity__c;
    trade.OpportunityStage = res.Related_Opportunity__r.StageName;
    trade.CreatedDate = res.Request_Time__c;
    trade.ContactName = res.Related_Opportunity__r.Account.Name;
    trade.SourceName = res.Created_From__c;
    trade.DocNum = res.Related_Opportunity__r.Account.NRIC_Number__c;
    trade.Mobile = res.Related_Opportunity__r.Account.Mobile_Preferred__pc;
    trade.Email = res.Related_Opportunity__r.Account.Default_Email__c;
    trade.Address = '<address>';
    trade.RegNo = res.Related_Opportunity__r.Registration_Num_Purchase__c;
    trade.Chassis = res.Related_Opportunity__r.Chassis__r?.Name;
    trade.RegDate = new Date().toString();
    trade.YearMake = '<year make>';
    trade.Make = res.Related_Opportunity__r.Chassis__r?.Vehicle_Make__r?.Name;
    trade.Model = res.Related_Opportunity__r.Chassis__r?.Vehicle_Model__r?.Name;
    trade.Variant = '<Variant>';
    trade.Mileage = '<Mileage>';
    trade.Color = '<Color>';
    trade.TradeInSource = '<trade in source>';
    trade.Purchaser = res.Request_To__r.Name;
    // trade.Warranty = new Date().toString();
    trade.Notes = res.Related_Opportunity__r.Remarks__c;
    // trade.ExpectedPrice = 1000;
    // trade.Overtrade = 1000;
    return trade;
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
      company: tradeIn?.Company,
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

  getPurchasers(name?: string): Observable<Purchaser[]> {
    const query = `SELECT Id, Name, CommunityNickname, Company__c FROM User WHERE UserRole.Name IN ('PPSL: Purchaser')
                   AND IsActive = true AND Name LIKE '%${name}%'`;
    return this.api.get<Query>(this.apiSettings.getQueryUrl(query)).pipe(
      map((res) => {
        console.log(res);
        if (!res || !res.records || res.records.length <= 0) {
          return [];
        }
        return res.records.map((obj) => {
          const purchaser = new Purchaser();
          purchaser.Id = obj.Id;
          purchaser.Name = obj.Name;
          purchaser.Company = obj.Company__c;
          return purchaser;
        });
      }),
      catchError((err) => {
        this.errorSrvc.presentServerErr(err);
        throw err;
      })
    );
  }

  getSources(): Observable<SelectOption[]> {
    throw new Error('Method not implemented.');
  }

  query() {
    return `SELECT Id, Name FROM ${this.SF_OBJ}`;
  }
}

class UpsertResp {
  purchaseOppId: string;
  err: string;
}
