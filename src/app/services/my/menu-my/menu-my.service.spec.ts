import { TestBed } from '@angular/core/testing';

import { MenuAPIMY } from './menu-my.service';

describe('MenuAPIMY', () => {
  let service: MenuAPIMY;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MenuAPIMY);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
