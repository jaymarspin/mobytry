import { Injectable, Inject } from '@angular/core';
import { Opportunity } from 'src/app/models/common/opportunity.model';
import { Observable, of, zip } from 'rxjs';
import { IOpportunityApi } from 'src/app/interfaces/opportunity-api.interface';
import { SelectOption } from 'src/app/models/common/select-option.model';
import { ApiService } from '../../common/api/api.service';
import { ApiMY } from '../api/api-my.service';
import { ErrorService } from '../../common/error/error.service';
import { map, tap, catchError, mergeMap } from 'rxjs/operators';
import { Query } from 'src/app/models/sg/query.model';
import { OppFilterModel } from 'src/app/models/common/filter.model';
import { OppConstant } from './opportunity.constant';
import { AuthenticationService } from '../../common/auth/auth.service';
import { User } from 'src/app/models/common/user.model';
import { Campaign } from 'src/app/models/common/campaign.model';
import { InfiniteScrollModel } from 'src/app/models/common/infinite-scroll.model';

@Injectable({
  providedIn: 'root',
})
export class OpportunityServiceMY implements IOpportunityApi<Opportunity> {
  private SF_OBJ = 'Opportunity';
  private getSFVersion = 'v44.0';
  private user: User;

  constructor(private api: ApiService, private apiSettings: ApiMY, private errorSrvc: ErrorService, private auth: AuthenticationService) {
    this.auth.subUser().subscribe((u) => {
      this.user = u;
      console.log(this.user);
    });
  }

  getOpportunities(filter: OppFilterModel, contactId: string): Observable<Opportunity[]> {
    let query = `${this.query()}`;
    if (contactId) {
      query = `${query} WHERE Account.Id = '${contactId}'`;
    } else if (filter) {
      //HELP ON OPP FILTER
      query = `${query} WHERE Account.Id = '${contactId}'`;
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
  }

  getOppInfinite(): Observable<InfiniteScrollModel<Opportunity[]>> {
    const query = `${this.query()} WHERE Type LIKE '%Vehicle Sales%'` + ` ORDER BY LastReferencedDate DESC NULLS LAST, LastViewedDate DESC NULLS LAST`;
    console.log(query);
    return this.api.get<Query>(this.apiSettings.getQueryUrl(query)).pipe(
      map((res) => {
        return this.getOppInfiniteRecur(res);
      })
    );
  }

  getOppInfiniteRecur(res: Query): InfiniteScrollModel<Opportunity[]> {
    if (!res || !res.records || res.records.length <= 0) {
      return new InfiniteScrollModel([], null);
    }
    const oppList = res.records.map((oppObj) => this.fromSF(oppObj));
    let next: Observable<InfiniteScrollModel<Opportunity[]>> = null;
    if (res.nextRecordsUrl) {
      next = this.api.get<Query>(this.apiSettings.getNextRecordsUrl(res.nextRecordsUrl)).pipe(
        map((nextRes) => {
          return this.getOppInfiniteRecur(nextRes);
        })
      );
    }
    return new InfiniteScrollModel(oppList, next, res.totalSize);
  }

  getOpportunitiesByKeyword(keyword: string): Observable<Opportunity[]> {
    const query = `${this.query()} WHERE IsClosed = false AND (Account.Name LIKE '%${keyword}%' OR Lead__r.Name LIKE '%${keyword}%') ORDER BY CreatedDate`;
    return this.api.get<Query>(this.apiSettings.getQueryUrl(query)).pipe(
      map((res) => {
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

  checkExistingOpportunity(personId: string, cmp: string, sc: string): Observable<Opportunity[]> {
    const query =
      `${this.query()} WHERE (AccountId = '${personId}' OR Lead__c = '${personId}') AND Sales_Rep_Name__c = '${sc}'` + ` AND Company__r.Name = '${cmp}'`;
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

  getOpportunitiesById(oppId: string): Observable<Opportunity> {
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
      map((opportunities: Opportunity[]) => {
        return opportunities && opportunities.length > 0 ? opportunities[0] : null;
      }),
      catchError((err) => {
        this.errorSrvc.presentServerErr(err);
        throw err;
      })
    );
  }

  fromSF(res): Opportunity {
    if (res == null) {
      throw new Error('Opp:fromSF:' + JSON.stringify(res));
    }
    const opp = new Opportunity();
    opp.ContactName = res.Account.Name;
    opp.Id = res.Id;
    opp.Flag = true;
    opp.CreatedDate = res.CreatedDate;
    opp.Type = 'OPEN';
    opp.Source = res.Channel__c;
    opp.ContactId = res.Account.Id;
    opp.Company = res.Company__r.Name;
    opp.Warmth = res.Probability;
    opp.Notes = 'Came in on Tuesday 23 April with his wife';
    opp.ModelInterest = res.Model_Interest__c ? res.Model_Interest__c.spilt(';') : [];
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
        const optList: SelectOption[] = [];
        const cmpgList: Campaign[] = [];
        for (const cmpg of res.records) {
          const cmpgObj = new Campaign();
          cmpgObj.Id = cmpg.Id;
          cmpgObj.Name = cmpg.Name;
          cmpgObj.Channel = cmpg.Channel;
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
    const query = `SELECT Id FROM RecordType WHERE Name = '${rtName}' AND SobjectType = 'Opportunity' LIMIT 1`;
    const urlFriendly = encodeURI(query);
    return this.api
      .get<Query>(`${this.apiSettings.getInstanceUrl()}/services/data/${this.getSFVersion}/query/?q=${urlFriendly}`)
      .pipe(map((res) => res.records[0].Id));
  }

  upsertOpp(opp: Opportunity): Observable<Opportunity> {
    /*
      String oppId, String accId, String leadId, String bizAccId, String bizTitle, String ownerId, String type, String cmp,
      String campaignId, String channel, String modelInterest, Boolean isDup, DateTime ppDate, String ppDateRange, String ppDateReason
    */
    //ISSUE ON API. PLS CHECK
    const req = {
      oppId: opp?.Id,
      accId: opp?.ContactId,
      ownerId: this.user.userId,
      leadId: opp?.ContactId,
      type: opp?.Type,
      cmp: opp?.Company,
      campaignId: opp?.Source,
      modelInterest: opp?.ModelInterest ? opp?.ModelInterest.join(';') : '',
      ppDate: new Date(),
      // warmth: '',
      // notes: '',
      isDup: false,
    };
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
      `Id, Type, CreatedDate, Probability, OwnerId, IsClosed, StageName, ` +
      `Model_Interest__c, Channel__c, Company__r.Name, ` +
      `Account.Id, Account.Name, Account.Account_Name__c, Account.Salutation,` +
      `Account.Doc_Type__c, Account.NRIC_Number__c, Account.Country__c`
    );
  }
}

class UpsertResp {
  oppId: string;
  err: string;
}
