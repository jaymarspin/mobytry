import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewLeadsPage } from './new-leads.page';

describe('NewLeadsPage', () => {
  let component: NewLeadsPage;
  let fixture: ComponentFixture<NewLeadsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NewLeadsPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(NewLeadsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
