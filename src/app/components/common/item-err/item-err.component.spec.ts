import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ItemErrComponent } from './item-err.component';

describe('ItemErrComponent', () => {
  let component: ItemErrComponent;
  let fixture: ComponentFixture<ItemErrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ItemErrComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemErrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
