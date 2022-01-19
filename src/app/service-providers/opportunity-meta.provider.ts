import { environment } from 'src/environments/environment';
import { OpportunityMetaMY } from '../services/my/opportunity/opportunity-meta-my.value';
import { OpportunityMetaSG } from '../services/sg/opportunity/opportunity-meta-sg.value';
import { OpportunityMeta } from '../models/common/opportunity-meta.model';

export const OPPORTUNITY_META_KEY = 'OpportunityMeta';
// This function returns the country specific instance based on the country code given
export function getOpportunityMeta(): OpportunityMeta {
  switch (environment.countryCode) {
    case 'sg':
      return OpportunityMetaSG;
    case 'my':
      return OpportunityMetaMY;
  }
}
