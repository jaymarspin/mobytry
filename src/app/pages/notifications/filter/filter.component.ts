import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NotificationsFilterModel } from '../../../models/common/filter.model';
@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit {
  filterForm: FormGroup;
  @Input() filterObj: NotificationsFilterModel;
  constructor(private modalCtrl: ModalController, private formBuilder: FormBuilder) {
    this.initFilterForm();
  }

  private initFilterForm(): FormGroup {
    const oppForm = this.formBuilder.group({
      startDate: [''],
      endDate: [''],
    });
    return oppForm;
  }
  reset() {
    this.filterObj = {
      startDate: '',
      endDate: '',
    };
    this.updateForm();
  }
  cancel() {
    this.modalCtrl.dismiss();
  }

  ngOnInit() {
    if (!this.filterObj) {
      this.reset();
    } else {
      this.updateForm();
    }
  }
  updateForm() {
    if (this.filterForm) {
      this.filterForm.reset({
        startDate: this.filterObj.startDate,
        endDate: this.filterObj.endDate,
      });
    }
  }

  apply() {
    this.modalCtrl.dismiss(this.filterObj);
  }
}
