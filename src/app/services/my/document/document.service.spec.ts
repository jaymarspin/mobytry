import { TestBed } from '@angular/core/testing';

import { DocumentServiceMY } from './document.service';

describe('DocumentServiceMY', () => {
  let service: DocumentServiceMY;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentServiceMY);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
