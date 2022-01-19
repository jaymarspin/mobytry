import { Injectable } from '@angular/core';
import { Observable, zip } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { IOpportunityApi } from 'src/app/interfaces/opportunity-api.interface';
import { Campaign } from 'src/app/models/common/campaign.model';
import { OppFilterModel } from 'src/app/models/common/filter.model';
import { InfiniteScrollModel } from 'src/app/models/common/infinite-scroll.model';
import { SelectOption } from 'src/app/models/common/select-option.model';
import { User } from 'src/app/models/common/user.model';
import { VehicleModel } from 'src/app/models/common/vehicle-model.model';
import { OpportunitySG } from 'src/app/models/sg/Opportunity-sg.model';
import { Query } from 'src/app/models/sg/query.model';
import { ApiService } from '../../common/api/api.service';
import { AuthenticationService } from '../../common/auth/auth.service';
import { ErrorService } from '../../common/error/error.service';
import { ApiSG } from '../api/api-sg.service';
import { ContactServiceSG } from '../contact-sg/contact-sg.service';
import { OppConstant } from './opportunity.constant';

@Injectable({
  providedIn: 'root',
})
export class OpportunityServiceSG implements IOpportunityApi<OpportunitySG> {
  private SF_OBJ = 'Opportunity';
  private getSFVersion = 'v44.0';
  private user: User;

  constructor(
    private api: ApiService,
    private apiSettings: ApiSG,
    private errorSrvc: ErrorService,
    private auth: AuthenticationService,
    private contactSG: ContactServiceSG
  ) {
    this.auth.subUser().subscribe((u) => {
      this.user = u;
    });
  }
  // TODO: where is filter implemented?
  getOpportunities(filter: OppFilterModel, contactId: string): Observable<OpportunitySG[]> {
    const idFields = contactId ? `(AccountId = '${contactId}' OR Lead__c = '${contactId}') AND ` : ``;
    const query =
      `${this.query()} WHERE ${idFields} Type LIKE '%Vehicle Sales%' AND Company__r.Name IN ('02', '888')` +
      ` ORDER BY LastReferencedDate DESC NULLS LAST,LastViewedDate DESC NULLS LAST`;
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
      })
    );
  }
  // recent, open, vehicle sales (new funct)

  getOppInfinite(key?: string): Observable<InfiniteScrollModel<OpportunitySG[]>> {
    const keyQuery = key
      ? `(Account.Name LIKE '%${key}%' OR Lead__r.Name LIKE '%${key}%' ` +
        `OR Account.Mobile_Preferred__pc = '${key}' OR Lead__r.Mobile_Preferred__c = '${key}') AND `
      : ``;
    const query =
      `${this.query()} WHERE ${keyQuery} Type LIKE '%Vehicle Sales%'` + ` ORDER BY LastReferencedDate DESC NULLS LAST, LastViewedDate DESC NULLS LAST LIMIT 50`;
    console.log(query);
    return this.api.get<Query>(this.apiSettings.getQueryUrl(query)).pipe(
      map((res) => {
        return this.getOppInfiniteRecur(res);
      })
    );
  }

  getOppInfiniteRecur(res: Query): InfiniteScrollModel<OpportunitySG[]> {
    if (!res || !res.records || res.records.length <= 0) {
      return new InfiniteScrollModel([], null);
    }
    const oppList = res.records.map((oppObj) => this.fromSF(oppObj));
    let next: Observable<InfiniteScrollModel<OpportunitySG[]>> = null;
    if (res.nextRecordsUrl) {
      next = this.api.get<Query>(this.apiSettings.getNextRecordsUrl(res.nextRecordsUrl)).pipe(
        map((nextRes) => {
          return this.getOppInfiniteRecur(nextRes);
        })
      );
    }
    return new InfiniteScrollModel(oppList, next, res.totalSize);
  }

  getOpportunitiesById(oppId: string): Observable<OpportunitySG> {
    if (!oppId) {
      throw new Error('Invalid Id.');
    }

    const query = `${this.query()} WHERE Id = '${oppId}'`;
    return this.api.get<Query>(this.apiSettings.getQueryUrl(query)).pipe(
      map((res) => {
        if (!res || !res.records || res.records.length <= 0) {
          return [];
        }
        return res.records.map((oppObj) => {
          return this.fromSF(oppObj);
        });
      }),
      map((opp: OpportunitySG[]) => {
        return opp && opp.length > 0 ? opp[0] : null;
      })
    );
  }

  getOpportunitiesByKeyword(keyword: string): Observable<OpportunitySG[]> {
    const query = `${this.query()} WHERE Account.Name LIKE '%${keyword}%' OR Lead__r.Name LIKE '%${keyword}%' ORDER BY CreatedDate DESC LIMIT 15`;
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

  checkExistingOpportunity(personId: string, cmp: string, sc: string): Observable<OpportunitySG[]> {
    const query =
      `${this.query()} WHERE (AccountId = '${personId}' OR Lead__c = '${personId}') AND Sales_Rep_Name__c = '${sc}'` +
      ` AND Company__r.Name = '${cmp}' AND IsClosed = false AND Type LIKE '%Vehicle Sales%' ORDER BY CreatedDate DESC`;
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

  fromSF(res): OpportunitySG {
    if (res == null) {
      throw new Error('Opp:fromSF:' + JSON.stringify(res));
    }
    const cmpg = new Campaign();
    if (res.Campaign) {
      cmpg.Name = res.Campaign.Name;
      cmpg.Id = res.CampaignId;
      cmpg.Channel = res.Campaign.Channel__c ? res.Campaign.Channel__c.split(';') : [];
    }
    const opp = new OpportunitySG();
    opp.ContactName = res.Account != null ? res.Account.Name : res.Lead__r.Name;
    opp.Id = res.Id;
    opp.Flag = true;
    opp.CreatedDate = res.CreatedDate;
    opp.Type = res.Type;
    opp.Cmpg = cmpg;
    opp.Channel = res.Channel__c ? res.Channel__c.split(';') : [];
    opp.ContactId = res.Account ? res.Account.Id : res.Lead__r.Id;
    opp.Company = res.Company__r.Name;
    opp.Warmth = res.Probability;
    opp.Notes = res.Description;
    opp.ModelInterest = res.Vehicle_Model_Interest__c ? res.Vehicle_Model_Interest__c.split(';') : [];
    opp.Stage = res.StageName;
    opp.IsClosed = res.IsClosed;
    opp.IntentStatus = res.Intent_Status_Text__c;
    opp.PlannedPurchasedDate = res.Planned_purchase_date__c;
    opp.PlannedPurchaseDateRange = res.Purchase_Vehicle_Intention__c;
    opp.PlannedPurchaseDateReason = res.Planned_Purchase_Date_Change_Reason__c;
    return opp;
  }

  getModelInterestArr(modelInterest: string) {
    const arr = modelInterest != null ? modelInterest.split(';') : [];
    return arr.map((el) => {
      const option = new SelectOption();
      option.label = el;
      option.value = el;
      return option;
    });
  }

  getModelInterest(company: string): Observable<SelectOption[]> {
    const queries: Observable<SelectOption[]>[] = [];
    queries.push(
      this.getOppRT(company).pipe(
        mergeMap((rtId, _) => {
          return this.api
            .get<Query>(
              `${this.apiSettings.getInstanceUrl()}/services/data/${this.getSFVersion}/ui-api/object-info/${
                this.SF_OBJ
              }/picklist-values/${rtId}/Model_Interest__c`
            )
            .pipe(
              tap((res) => {
                console.log(res);
              }),
              map((res) => {
                if (!res || !res[`values`] || res[`values`].length <= 0) {
                  return [];
                }
                return res[`values`].map((vehObj) => {
                  const veh = new SelectOption();
                  veh.label = vehObj.label;
                  veh.value = vehObj.value;
                  return veh;
                });
              })
            );
        })
      )
    );
    return zip(...queries).pipe(
      map((obj) => {
        const rv = [];
        obj.forEach((val) => rv.push(...val));
        return rv;
      })
    );
  }

  retrieveVehModelInt(cmpFilter: Set<string>): Observable<VehicleModel[]> {
    const query =
      `SELECT Id, Name, Description__c, Short_Description__c, Series_Picklist__c, Vehicle_Type__r.Id, Vehicle_Type__r.Name,` +
      ` Company__r.Id, Company__r.Name, Vehicle_Make__r.Name FROM Vehicle_Model__c` +
      ` WHERE Available_for_Selection_Reception__c = true` +
      ` AND Vehicle_Type__r.Name = \'NC\' AND Vehicle_Make__r.Name IN (\'BMW\', \'BI\')` +
      ` AND Company__r.Name IN ('${Array.from(cmpFilter).join(`','`)}') ORDER BY Series_Picklist__c ASC`;
    const urlFriendly = encodeURI(query);
    const vehModelList = new Array<VehicleModel>();
    return this.api.get<Query>(`${this.apiSettings.getInstanceUrl()}/services/data/${this.getSFVersion}/query/?q=${urlFriendly}`).pipe(
      map((res: Query) => {
        for (const model of res.records) {
          const vehModelObj = new VehicleModel();
          vehModelObj.Name = model.Name;
          vehModelObj.Description = model.Desciption__c;
          vehModelObj.Id = model.Id;
          vehModelObj.ShortDescription = model.Short_Description__c;
          vehModelObj.SeriesPicklist = model.Series_Picklist__c;
          vehModelObj.VehMake = model.Vehicle_Make__r.Name;
          vehModelObj.VehType = model.Vehicle_Type__r.Name;
          vehModelObj.Company = model.Company__r.Name;
          vehModelList.push(vehModelObj);
        }
        return vehModelList;
      })
    );
  }

  getPPDateRange(company: string): Observable<SelectOption[]> {
    const queries: Observable<SelectOption[]>[] = [];
    queries.push(
      this.getOppRT(company).pipe(
        mergeMap((rtId, _) => {
          return this.api
            .get<Query>(
              `${this.apiSettings.getInstanceUrl()}/services/data/${this.getSFVersion}/ui-api/object-info/${
                this.SF_OBJ
              }/picklist-values/${rtId}/Purchase_Vehicle_Intention__c`
            )
            .pipe(
              tap((res) => {
                console.log(res);
              }),
              map((res) => {
                if (!res || !res[`values`] || res[`values`].length <= 0) {
                  return [];
                }
                return res[`values`].map((obj) => {
                  const opt = new SelectOption();
                  opt.label = obj.label;
                  opt.value = obj.value;
                  return opt;
                });
              })
            );
        })
      )
    );
    return zip(...queries).pipe(
      map((obj) => {
        const rv = [];
        obj.forEach((val) => rv.push(...val));
        return rv;
      })
    );
  }

  getCmpgList(cmpFilter: string): Observable<Campaign[]> {
    const query =
      `SELECT Name, Id, StartDate, IsEvergreen__c, Channel__c FROM Campaign` +
      ` WHERE IsActive = true AND (Available_For_Selection_SC__c = true OR IsEvergreen__c = true)` +
      ` AND Name NOT IN (\'PML: Showroom Visit\',\'PMA: Showroom Visit\')` +
      ` AND StartDate <= TODAY AND Monitor_End_Date__c >= TODAY` +
      ` AND Company__r.Name = '${cmpFilter}'` +
      ` ORDER BY startDate DESC`;
    const urlFriendly = encodeURI(query);
    return this.api.get<Query>(`${this.apiSettings.getInstanceUrl()}/services/data/${this.getSFVersion}/query/?q=${urlFriendly}`).pipe(
      map((res) => {
        const cmpgList: Campaign[] = [];
        for (const resCmpg of res.records) {
          const cmpgObj = new Campaign();
          cmpgObj.Id = resCmpg.Id;
          cmpgObj.Name = resCmpg.Name;
          cmpgObj.Channel = resCmpg.Channel__c ? resCmpg.Channel__c.split(';') : [];
          cmpgList.push(cmpgObj);
        }
        return cmpgList;
      })
    );
  }

  getOppRT(cmp: string): Observable<string> {
    const rtName = OppConstant.RT_MAP[cmp];

    if (rtName == null) {
      throw new Error('Unable to find proper recordtype mapping: ' + cmp);
    }
    let query = `SELECT Id FROM RecordType WHERE Name = '${rtName}' AND SobjectType = 'Opportunity' LIMIT 1`;
    if (!cmp) {
      query = `SELECT Id FROM RecordType WHERE SobjectType = 'Opportunity' LIMIT 1`;
    }

    const urlFriendly = encodeURI(query);
    return this.api
      .get<Query>(`${this.apiSettings.getInstanceUrl()}/services/data/${this.getSFVersion}/query/?q=${urlFriendly}`)
      .pipe(map((res) => res.records[0].Id));
  }

  getTaskRT(): Observable<string> {
     
    let query = `SELECT Id FROM RecordType WHERE Name = 'Automated Tasks' AND SobjectType = 'Task' LIMIT 1`;
  

    const urlFriendly = encodeURI(query);
    return this.api
      .get<Query>(
        `${this.apiSettings.getInstanceUrl()}/services/data/${this.getSFVersion}/query/?q=${urlFriendly}`
      )
      .pipe(map((res) => res.records[0].Id));
  }

  upsertOpp(opp: OpportunitySG): Observable<OpportunitySG> {  
    if (!opp) {
      throw new Error('Null opp');
    }
    const isAcc = this.contactSG.isSFAccId(opp.ContactId);
    const req = {
      oppId: opp.Id,
      accId: isAcc ? opp.ContactId : '',
      leadId: !isAcc ? opp.ContactId : '',
      bizAccId: '',
      bizTitle: '',
      ownerId: this.user.userId,
      type: opp.Type,
      cmp: opp.Company,
      campaignId: opp.Cmpg.Id,
      channel: opp.Channel ? opp.Channel.join(';') : '',
      isDup: false,
      modelInterest: opp.ModelInterest ? opp.ModelInterest.join(';') : '',
      ppDateReason: opp.PlannedPurchaseDateReason,
    };

    if (opp.PlannedPurchaseDateRange === 'Custom') {
      req['ppDate'] = opp.PlannedPurchasedDate;
    } else {
      req['ppDateRange'] = opp.PlannedPurchaseDateRange;
    }
    console.log(req);
    return this.api.post<UpsertResp>(this.apiSettings.getAPIUrl('assistant/opp/upsert'), req).pipe(
      mergeMap((res) => this.getOpportunitiesById(res.oppId)),
      catchError((err) => {
        this.errorSrvc.presentServerErr(err);
        throw err;
      })
    );
  }

  getStringFromArray(modelInterest: SelectOption[]): string {
    let interest = '';
    modelInterest.forEach((el, i) => {
      if (i === modelInterest.length - 1) {
        interest = interest + el.value;
      } else {
        interest = interest + el.value + ';';
      }
    });
    return interest;
  }

  getSource(companyName: string): Observable<SelectOption[]> {
    const sqlStatement =
      'SELECT Name, Id, StartDate, IsEvergreen__c, Channel__c FROM Campaign WHERE IsActive = true AND ' +
      `(Available_For_Selection_SC__c = true OR IsEvergreen__c = true) AND Name NOT IN ('PML: Showroom Visit','PMA: Showroom Visit') ` +
      `AND Company__r.Name = '${companyName}' AND StartDate <= TODAY AND Monitor_End_Date__c >= TODAY ORDER BY startDate DESC`;
    const queries: Observable<SelectOption[]>[] = [];
    queries.push(
      this.api.get<Query>(this.apiSettings.getQueryUrl(sqlStatement)).pipe(
        tap((res) => {
          console.log(res);
        }),
        map((res) => {
          if (!res || !res.records || res.records.length <= 0) {
            return [];
          }
          return res.records.map((sourceObj) => {
            return this.fromCampaignAccount(sourceObj);
          });
        })
      )
    );
    return zip(...queries).pipe(
      map((obj) => {
        const rv = [];
        obj.forEach((val) => rv.push(...val));
        return rv;
      })
    );
  }

  public fromCampaignAccount(sfCampaign: any): SelectOption {
    const rv = new SelectOption();
    rv.label = sfCampaign.Name;
    rv.value = sfCampaign.Id;
    return rv;
  }

  public query(): string {
    return `SELECT ${this.fields()} FROM ${this.SF_OBJ}`;
  }

  public fields(): string {
    return (
      `Id, Type, CreatedDate, Probability, OwnerId, IsClosed, StageName, CampaignId, Campaign.Name, Campaign.Channel__c, ` +
      `Model_Interest__c, Channel__c, Company__r.Name, Intent_Status_Text__c, Vehicle_Model_Interest__c, ` +
      `Planned_Purchase_Date__c, Purchase_Vehicle_Intention__c, Planned_Purchase_Date_Change_Reason__c, ` +
      `Lead__r.Id, Lead__r.Name, Lead__r.Surname__c, Lead__r.Salutation, ` +
      `Account.Id, Account.Name, Account.Account_Name__c, Account.Salutation, Description `
    );
  }
}

class UpsertResp {
  oppId: string;
  err: string;
}
