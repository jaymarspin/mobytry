import { TestBed } from '@angular/core/testing';

import { PDFSignService } from './pdfsign.service';

describe('PDFSignService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PDFSignService = TestBed.get(PDFSignService);
    expect(service).toBeTruthy();
  });
});
