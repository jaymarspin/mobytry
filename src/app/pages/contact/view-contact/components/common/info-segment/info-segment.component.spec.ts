import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InfoSegmentComponent } from './info-segment.component';

describe('InfoSegmentComponent', () => {
  let component: InfoSegmentComponent;
  let fixture: ComponentFixture<InfoSegmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InfoSegmentComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(InfoSegmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
