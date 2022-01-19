import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FilterTradeinComponent } from './filter-tradein.component';

describe('FilterTradeinComponent', () => {
  let component: FilterTradeinComponent;
  let fixture: ComponentFixture<FilterTradeinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FilterTradeinComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(FilterTradeinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
