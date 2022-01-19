import { TestBed } from '@angular/core/testing';

import { MenuAPISG } from './menu-sg.service';

describe('MenuAPISG', () => {
  let service: MenuAPISG;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MenuAPISG);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
