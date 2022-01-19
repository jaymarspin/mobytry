import { Component, OnInit, Input } from '@angular/core';
import { TaskFilterModel } from 'src/app/models/common/filter.model';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-filter-task',
  templateUrl: './filter-task.component.html',
  styleUrls: ['./filter-task.component.scss'],
})
export class FilterTaskComponent implements OnInit {
  @Input() filterObj: TaskFilterModel;
  maxdate = new Date(new Date().setFullYear(new Date().getFullYear() + 5)).getFullYear();
  mindate = new Date(new Date().setFullYear(new Date().getFullYear() - 5)).getFullYear();

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    if (!this.filterObj) {
      this.reset();
    }
  }

  reset() {
    this.filterObj = {
      category: 'all',
      taskStatus: 'all',
      endDate: '',
      startDate: '',
    };
  }

  getOpenIcon() {
    if (this.filterObj.taskStatus.toLocaleLowerCase() === 'open') {
      return 'assets/icon/opportunity/unlock.svg';
    } else {
      return 'assets/icon/opportunity/unlock-disabled.svg';
    }
  }

  updateTaskStatus(type: string) {
    if (type === 'open') {
      this.filterObj.taskStatus = 'open';
    } else if (type === 'completed') {
      this.filterObj.taskStatus = 'completed';
    } else if (type === 'all') {
      this.filterObj.taskStatus = 'all';
    } else {
      this.filterObj.taskStatus = 'aging';
    }
  }

  getEndDate() {
    if (this.filterObj.startDate) {
      return new Date(this.filterObj.startDate).toISOString();
    } else {
      return this.mindate;
    }
  }

  apply() {
    this.modalCtrl.dismiss(this.filterObj);
  }

  cancel() {
    this.modalCtrl.dismiss();
  }
}
