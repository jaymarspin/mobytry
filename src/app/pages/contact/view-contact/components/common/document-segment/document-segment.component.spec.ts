import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DocumentSegmentComponent } from './document-segment.component';

describe('DocumentSegmentComponent', () => {
  let component: DocumentSegmentComponent;
  let fixture: ComponentFixture<DocumentSegmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentSegmentComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentSegmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
