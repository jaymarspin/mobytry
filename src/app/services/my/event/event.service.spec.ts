import { TestBed } from '@angular/core/testing';

import { EventServiceMY } from './event.service';

describe('EventService', () => {
  let service: EventServiceMY;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventServiceMY);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
