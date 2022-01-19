import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OppListPage } from './opp-list.page';

describe('OppListPage', () => {
  let component: OppListPage;
  let fixture: ComponentFixture<OppListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OppListPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(OppListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
