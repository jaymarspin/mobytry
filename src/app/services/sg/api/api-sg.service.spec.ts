import { TestBed } from '@angular/core/testing';

import { ApiSG } from './api-sg.service';

describe('ApiSG', () => {
  let service: ApiSG;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiSG);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
