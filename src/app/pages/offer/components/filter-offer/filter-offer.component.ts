import { Component, OnInit, Input } from '@angular/core';
import { OfferFilterModel } from 'src/app/models/common/filter.model';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-filter-offer',
  templateUrl: './filter-offer.component.html',
  styleUrls: ['./filter-offer.component.scss'],
})
export class FilterOfferComponent implements OnInit {
  @Input() filterObj: OfferFilterModel;

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    if (!this.filterObj) {
      this.reset();
    }
  }

  getData() {}

  reset() {
    this.filterObj = {
      offerStatus: 'all',
    };
  }

  apply() {
    this.modalCtrl.dismiss(this.filterObj);
  }

  cancel() {
    this.modalCtrl.dismiss();
  }

  getUpcomingIcon() {
    if (this.filterObj.offerStatus === 'upcoming') {
      return 'assets/icon/opportunity/upcoming.svg';
    } else {
      return 'assets/icon/opportunity/upcoming-disabled.svg';
    }
  }

  updateOfferStatus(type: string) {
    if (type === 'active') {
      this.filterObj.offerStatus = 'active';
    } else if (type === 'rejected') {
      this.filterObj.offerStatus = 'rejected';
    } else if (type === 'all') {
      this.filterObj.offerStatus = 'all';
    } else {
      this.filterObj.offerStatus = 'accepted';
    }
  }
}
