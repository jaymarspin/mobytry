import { TestBed } from '@angular/core/testing';

import { UserAPIMY } from './user-my.service';

describe('UserAPIMY', () => {
  let service: UserAPIMY;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserAPIMY);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
