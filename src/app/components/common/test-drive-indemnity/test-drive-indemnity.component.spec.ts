import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TestDriveIndemnityComponent } from './test-drive-indemnity.component';

describe('TestDriveIndemnityPage', () => {
  let component: TestDriveIndemnityComponent;
  let fixture: ComponentFixture<TestDriveIndemnityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestDriveIndemnityComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [IonicModule.forRoot()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestDriveIndemnityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
