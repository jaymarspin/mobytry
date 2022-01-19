import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyScannerComponent } from './key-scanner.component';

describe('KeyScannerComponent', () => {
  let component: KeyScannerComponent;
  let fixture: ComponentFixture<KeyScannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [KeyScannerComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyScannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
