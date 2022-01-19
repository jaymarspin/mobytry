import { TestBed } from '@angular/core/testing';

import { ContactServiceMY } from './contact-my.service';

describe('ContactServiceMY', () => {
  let service: ContactServiceMY;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContactServiceMY);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
