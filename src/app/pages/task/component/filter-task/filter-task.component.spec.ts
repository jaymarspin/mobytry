import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FilterTaskComponent } from './filter-task.component';

describe('FilterTaskComponent', () => {
  let component: FilterTaskComponent;
  let fixture: ComponentFixture<FilterTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FilterTaskComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(FilterTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
