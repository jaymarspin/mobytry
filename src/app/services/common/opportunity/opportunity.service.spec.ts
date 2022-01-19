import { TestBed } from '@angular/core/testing';

import { CommonOpportunityService } from './opportunity.service';

describe('CommonOpportunityService', () => {
  let service: CommonOpportunityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonOpportunityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
