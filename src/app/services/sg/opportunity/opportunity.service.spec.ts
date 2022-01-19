import { TestBed } from '@angular/core/testing';

import { OpportunityServiceSG } from './opportunity-sg.service';

describe('OpportunityServiceSG', () => {
  let service: OpportunityServiceSG;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpportunityServiceSG);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
