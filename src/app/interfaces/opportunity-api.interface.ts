import { Observable } from 'rxjs';
import { Opportunity } from '../models/common/opportunity.model';
import { Campaign } from '../models/common/campaign.model';
import { SelectOption } from '../models/common/select-option.model';
import { OppFilterModel } from '../models/common/filter.model';
import { InfiniteScrollModel } from '../models/common/infinite-scroll.model';

export interface IOpportunityApi<T> {
  getOpportunities(filter: OppFilterModel, contactId: string): Observable<T[]>;
  getOppInfinite(key?: string): Observable<InfiniteScrollModel<T[]>>;
  getOpportunitiesById(oppId: string): Observable<T>;
  checkExistingOpportunity(personId: string, cmp: string, sc: string): Observable<T[]>;
  getModelInterest(company: string): Observable<SelectOption[]>;
  getPPDateRange(company: string): Observable<SelectOption[]>;
  getCmpgList(company: string): Observable<Campaign[]>;
  getSource(companyName: string): Observable<SelectOption[]>;
  upsertOpp(opp: Opportunity): Observable<T>;
  getOpportunitiesByKeyword(keyword: string): Observable<T[]>;
}
