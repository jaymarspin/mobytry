import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TradeinsPage } from './tradeins.page';

describe('TradeinsPage', () => {
  let component: TradeinsPage;
  let fixture: ComponentFixture<TradeinsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TradeinsPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(TradeinsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
