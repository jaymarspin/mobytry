import { TestBed } from '@angular/core/testing';

import { CommonContactService } from './contact.service';

describe('CommonContactService', () => {
  let service: CommonContactService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonContactService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
