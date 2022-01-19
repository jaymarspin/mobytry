import { TestBed } from '@angular/core/testing';

import { NotificationAPIMY } from './notification-api-my.service';

describe('NotificationAPIMY', () => {
  let service: NotificationAPIMY;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationAPIMY);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
