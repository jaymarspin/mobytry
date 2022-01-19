import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ViewTestdrivePage } from './view-testdrive.page';

describe('ViewTestdrivePage', () => {
  let component: ViewTestdrivePage;
  let fixture: ComponentFixture<ViewTestdrivePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ViewTestdrivePage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewTestdrivePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
