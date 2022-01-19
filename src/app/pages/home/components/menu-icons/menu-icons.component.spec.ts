import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MenuIconsComponent } from './menu-icons.component';

describe('MenuIconsComponent', () => {
  let component: MenuIconsComponent;
  let fixture: ComponentFixture<MenuIconsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MenuIconsComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuIconsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
