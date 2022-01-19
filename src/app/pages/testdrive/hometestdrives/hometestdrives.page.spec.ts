import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HometestdrivesPage } from './hometestdrives.page';

describe('HometestdrivesPage', () => {
  let component: HometestdrivesPage;
  let fixture: ComponentFixture<HometestdrivesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HometestdrivesPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(HometestdrivesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
