import { TestBed } from '@angular/core/testing';

import { ContactServiceSG } from './contact-sg.service';

describe('ContactServiceSG', () => {
  let service: ContactServiceSG;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContactServiceSG);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
