import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ViewOfferPage } from './view-offer.page';

describe('ViewOfferPage', () => {
  let component: ViewOfferPage;
  let fixture: ComponentFixture<ViewOfferPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ViewOfferPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewOfferPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
