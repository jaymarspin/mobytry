import { Opportunity } from '../common/opportunity.model';

export class OpportunitySG extends Opportunity {
  constructor(values: object = {}) {
    super(values);
    Object.assign(this, values);
  }
}
