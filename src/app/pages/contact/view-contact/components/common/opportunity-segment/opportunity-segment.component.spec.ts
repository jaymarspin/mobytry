import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OpportunitySegmentComponent } from './opportunity-segment.component';

describe('OpportunitySegmentComponent', () => {
  let component: OpportunitySegmentComponent;
  let fixture: ComponentFixture<OpportunitySegmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OpportunitySegmentComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(OpportunitySegmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
