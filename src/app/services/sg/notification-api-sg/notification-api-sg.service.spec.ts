import { TestBed } from '@angular/core/testing';

import { NotificationAPISG } from './notification-api-sg.service';

describe('NotificationAPISG', () => {
  let service: NotificationAPISG;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationAPISG);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
