import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VehicleDetailsMyComponent } from './vehicle-details-my.component';

describe('VehicleDetailsMyComponent', () => {
  let component: VehicleDetailsMyComponent;
  let fixture: ComponentFixture<VehicleDetailsMyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VehicleDetailsMyComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(VehicleDetailsMyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
