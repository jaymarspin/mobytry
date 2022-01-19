import { TestBed } from '@angular/core/testing';

import { CommonDocumentService } from './document.service';

describe('CommonDocumentService', () => {
  let service: CommonDocumentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonDocumentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
