import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TradeinFormMyComponent } from './tradein-form-my.component';

describe('TradeinFormMyComponent', () => {
  let component: TradeinFormMyComponent;
  let fixture: ComponentFixture<TradeinFormMyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TradeinFormMyComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(TradeinFormMyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
