import { TestBed } from '@angular/core/testing';

import { CommonTestdriveService } from './testdrive.service';

describe('CommonTestdriveService', () => {
  let service: CommonTestdriveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonTestdriveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
