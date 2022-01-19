import { TestBed } from '@angular/core/testing';

import { EventServiceSG } from './event.service';

describe('EventService', () => {
  let service: EventServiceSG;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventServiceSG);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
