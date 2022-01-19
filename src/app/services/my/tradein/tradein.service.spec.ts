import { TestBed } from '@angular/core/testing';

import { TradeinServiceMY } from './tradein.service';

describe('TradeinServiceMY', () => {
  let service: TradeinServiceMY;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TradeinServiceMY);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
