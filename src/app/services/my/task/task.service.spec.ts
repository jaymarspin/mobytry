import { TestBed } from '@angular/core/testing';

import { TaskServiceMY } from './task.service';

describe('TaskServiceMY', () => {
  let service: TaskServiceMY;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskServiceMY);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
