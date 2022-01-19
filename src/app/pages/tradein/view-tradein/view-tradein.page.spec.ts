import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ViewTradeinPage } from './view-tradein.page';

describe('ViewTradeinPage', () => {
  let component: ViewTradeinPage;
  let fixture: ComponentFixture<ViewTradeinPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ViewTradeinPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewTradeinPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
