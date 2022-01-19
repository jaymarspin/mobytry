import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OpportunityFormSgComponent } from './opportunity-form-sg.component';

describe('OpportunityFormSgComponent', () => {
  let component: OpportunityFormSgComponent;
  let fixture: ComponentFixture<OpportunityFormSgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OpportunityFormSgComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(OpportunityFormSgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
