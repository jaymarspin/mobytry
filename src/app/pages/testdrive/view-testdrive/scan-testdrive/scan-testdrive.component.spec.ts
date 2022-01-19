import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ScanTestdriveComponent } from './scan-testdrive.component';

describe('ScanTestdriveComponent', () => {
  let component: ScanTestdriveComponent;
  let fixture: ComponentFixture<ScanTestdriveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ScanTestdriveComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(ScanTestdriveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
