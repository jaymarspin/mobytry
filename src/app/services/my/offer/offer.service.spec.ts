import { TestBed } from '@angular/core/testing';

import { OfferServiceMY } from './offer.service';

describe('OfferService', () => {
  let service: OfferServiceMY;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OfferServiceMY);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
