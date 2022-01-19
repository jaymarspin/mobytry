import { TestBed } from '@angular/core/testing';

import { DocumentServiceSG } from './document.service';

describe('DocumentServiceSG', () => {
  let service: DocumentServiceSG;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentServiceSG);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
