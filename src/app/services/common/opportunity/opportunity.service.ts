import { Injectable, Inject } from '@angular/core';
import { ErrorService } from '../error/error.service';
import { IOpportunityApi } from 'src/app/interfaces/opportunity-api.interface';
import { OPPORTUNITY_SERVICE_KEY } from 'src/app/service-providers/dynamic-key.provider';
import { Observable } from 'rxjs';
import { Opportunity } from 'src/app/models/common/opportunity.model';
import { Campaign } from 'src/app/models/common/campaign.model';
import { SelectOption } from 'src/app/models/common/select-option.model';
import { OPPORTUNITY_META_KEY } from 'src/app/service-providers/opportunity-meta.provider';
import { OpportunityMeta } from 'src/app/models/common/opportunity-meta.model';
import { OppFilterModel } from 'src/app/models/common/filter.model';
import { InfiniteScrollModel } from 'src/app/models/common/infinite-scroll.model';

@Injectable({
  providedIn: 'root',
})
export class CommonOpportunityService {
  constructor(
    @Inject(OPPORTUNITY_SERVICE_KEY) private opportunityAPI: IOpportunityApi<Opportunity>,
    private errorSrvc: ErrorService,
    @Inject(OPPORTUNITY_META_KEY) private opportunityMetaParam: OpportunityMeta
  ) {}

  getOpportunities(filter: OppFilterModel, contactId?: string): Observable<Opportunity[]> {
    const id = contactId ? contactId : '';
    try {
      return this.opportunityAPI.getOpportunities(filter, id);
    } catch (e) {
      this.errorSrvc.presentServerErr(e);
    }
  }
  getOppInfinite(key?: string): Observable<InfiniteScrollModel<Opportunity[]>> {
    try {
      return this.opportunityAPI.getOppInfinite(key);
    } catch (e) {
      this.errorSrvc.presentServerErr(e);
    }
  }

  getOpportunityById(oppId: string): Observable<Opportunity> {
    try {
      if (oppId && oppId.trim()) {
        return this.opportunityAPI.getOpportunitiesById(oppId);
      }
    } catch (e) {
      this.errorSrvc.presentServerErr(e);
    }
  }

  getOpportunityByKeyword(keyword: string): Observable<Opportunity[]> {
    try {
      return this.opportunityAPI.getOpportunitiesByKeyword(keyword);
    } catch (e) {
      this.errorSrvc.presentServerErr(e);
    }
  }

  checkExistingOpportunity(personId: string, cmp: string, sc: string): Observable<Opportunity[]> {
    try {
      return this.opportunityAPI.checkExistingOpportunity(personId, cmp, sc);
    } catch (e) {
      this.errorSrvc.presentServerErr(e);
    }
  }

  getModelInterest(company: string): Observable<SelectOption[]> {
    try {
      return this.opportunityAPI.getModelInterest(company);
    } catch (e) {
      this.errorSrvc.presentServerErr(e);
    }
  }

  getPPDateRange(company: string): Observable<SelectOption[]> {
    try {
      return this.opportunityAPI.getPPDateRange(company);
    } catch (e) {
      this.errorSrvc.presentServerErr(e);
    }
  }

  getCmpgList(company: string): Observable<Campaign[]> {
    try {
      return this.opportunityAPI.getCmpgList(company);
    } catch (e) {
      this.errorSrvc.presentServerErr(e);
    }
  }

  getSource(companyName: string): Observable<SelectOption[]> {
    try {
      return this.opportunityAPI.getSource(companyName);
    } catch (e) {
      this.errorSrvc.presentServerErr(e);
    }
  }

  upsertOpp(opportunity: Opportunity): Observable<Opportunity> {
    try {
      return this.opportunityAPI.upsertOpp(opportunity);
    } catch (e) {
      this.errorSrvc.presentServerErr(e);
    }
  }

  getVehicleType(): SelectOption[] {
    return this.opportunityMetaParam.vehicleType;
  }

  getStarredFilterOptions() {
    return this.opportunityMetaParam.starredFilter;
  }

  getCompanyList() {
    return this.opportunityMetaParam.company;
  }
}
