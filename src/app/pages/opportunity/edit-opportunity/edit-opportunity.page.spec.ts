import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditOpportunityPage } from './edit-opportunity.page';

describe('EditOpportunityPage', () => {
  let component: EditOpportunityPage;
  let fixture: ComponentFixture<EditOpportunityPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditOpportunityPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(EditOpportunityPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
