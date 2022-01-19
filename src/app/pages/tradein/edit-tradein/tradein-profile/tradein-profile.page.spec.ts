import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TradeinProfilePage } from './tradein-profile.page';

describe('TradeinProfilePage', () => {
  let component: TradeinProfilePage;
  let fixture: ComponentFixture<TradeinProfilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TradeinProfilePage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(TradeinProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
