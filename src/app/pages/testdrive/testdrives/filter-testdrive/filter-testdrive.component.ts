import { Component, OnInit, Input } from '@angular/core';
import { TdFilterModel } from 'src/app/models/common/filter.model';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-filter-testdrive',
  templateUrl: './filter-testdrive.component.html',
  styleUrls: ['./filter-testdrive.component.scss'],
})
export class FilterTestdriveComponent implements OnInit {
  @Input() filterObj: TdFilterModel;

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    if (!this.filterObj) {
      this.reset();
    }
  }

  getData() {}

  reset() {
    this.filterObj = {
      tdStatus: 'all',
    };
  }

  apply() {
    this.modalCtrl.dismiss(this.filterObj);
  }

  cancel() {
    this.modalCtrl.dismiss();
  }

  getUpcomingIcon() {
    if (this.filterObj.tdStatus === 'upcoming') {
      return 'assets/icon/opportunity/upcoming.svg';
    } else {
      return 'assets/icon/opportunity/upcoming-disabled.svg';
    }
  }

  updateTdStatus(type: string) {
    if (type === 'ongoing') {
      this.filterObj.tdStatus = 'ongoing';
    } else if (type === 'upcoming') {
      this.filterObj.tdStatus = 'upcoming';
    } else if (type === 'all') {
      this.filterObj.tdStatus = 'all';
    } else {
      this.filterObj.tdStatus = 'completed';
    }
  }
}
