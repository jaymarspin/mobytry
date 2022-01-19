import { TestBed } from '@angular/core/testing';

import { TradeinService } from './tradein.service';

describe('TradeinService', () => {
  let service: TradeinService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TradeinService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
