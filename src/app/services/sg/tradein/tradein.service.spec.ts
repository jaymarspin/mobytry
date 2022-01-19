import { TestBed } from '@angular/core/testing';

import { TradeinServiceSG } from './tradein.service';

describe('TradeinServiceSG', () => {
  let service: TradeinServiceSG;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TradeinServiceSG);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
