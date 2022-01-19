import { TestBed } from '@angular/core/testing';

import { ApiMY } from './api-my.service';

describe('ApiMY', () => {
  let service: ApiMY;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiMY);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
