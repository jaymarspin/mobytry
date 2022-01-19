import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditTestdrivePage } from './edit-testdrive.page';

describe('EditTestdrivePage', () => {
  let component: EditTestdrivePage;
  let fixture: ComponentFixture<EditTestdrivePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditTestdrivePage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(EditTestdrivePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
