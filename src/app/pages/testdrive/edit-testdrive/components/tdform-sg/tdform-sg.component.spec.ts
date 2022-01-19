import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TdformSgComponent } from './tdform-sg.component';

describe('TdformSgComponent', () => {
  let component: TdformSgComponent;
  let fixture: ComponentFixture<TdformSgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TdformSgComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(TdformSgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
