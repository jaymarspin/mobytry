import { TestBed } from '@angular/core/testing';

import { OfferServiceSG } from './offer.service';

describe('OfferService', () => {
  let service: OfferServiceSG;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OfferServiceSG);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
