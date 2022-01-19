import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FilterOfferComponent } from './filter-offer.component';

describe('FilterOfferComponent', () => {
  let component: FilterOfferComponent;
  let fixture: ComponentFixture<FilterOfferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FilterOfferComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(FilterOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
