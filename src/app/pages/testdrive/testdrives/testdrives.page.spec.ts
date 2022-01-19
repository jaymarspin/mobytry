import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TestdrivesPage } from './testdrives.page';

describe('TestdrivesPage', () => {
  let component: TestdrivesPage;
  let fixture: ComponentFixture<TestdrivesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestdrivesPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestdrivesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
