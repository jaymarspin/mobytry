import { TestBed } from '@angular/core/testing';

import { TaskServiceSG } from './task.service';

describe('TaskServiceSG', () => {
  let service: TaskServiceSG;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskServiceSG);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
