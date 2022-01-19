import { TestBed } from '@angular/core/testing';

import { OpportunityServiceMY } from './opportunity-my.service';

describe('OpportunityServiceMY', () => {
  let service: OpportunityServiceMY;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpportunityServiceMY);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
