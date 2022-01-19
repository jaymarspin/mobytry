import { TestBed } from '@angular/core/testing';

import { UserAPISG } from './user-sg.service';

describe('UserAPISG', () => {
  let service: UserAPISG;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserAPISG);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
