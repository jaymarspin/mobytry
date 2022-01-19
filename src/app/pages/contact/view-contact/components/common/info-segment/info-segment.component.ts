import { Component, OnInit, Input } from '@angular/core';
import { ContactModel } from 'src/app/models/common/contact.model';
import { VehicleOwnership } from 'src/app/models/common/vehicle-ownership.model';

@Component({
  selector: 'app-info-segment',
  templateUrl: './info-segment.component.html',
  styleUrls: ['./info-segment.component.scss'],
})
export class InfoSegmentComponent implements OnInit {
  showMoreInfo = false;
  @Input() contact: ContactModel;
  @Input() vehicles: VehicleOwnership[];

  constructor() {}

  ngOnInit() {}

  showMore() {
    this.showMoreInfo = !this.showMoreInfo;
  }
}
