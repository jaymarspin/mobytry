import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FilterTestdriveComponent } from './filter-testdrive.component';

describe('FilterTestdriveComponent', () => {
  let component: FilterTestdriveComponent;
  let fixture: ComponentFixture<FilterTestdriveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FilterTestdriveComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(FilterTestdriveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
