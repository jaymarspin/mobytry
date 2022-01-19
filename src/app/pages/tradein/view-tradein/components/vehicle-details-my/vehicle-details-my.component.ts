import { Component, OnInit, Input } from '@angular/core';
import { TradeIn } from 'src/app/models/common/tradein.model';

@Component({
  selector: 'app-vehicle-details-my',
  templateUrl: './vehicle-details-my.component.html',
  styleUrls: ['./vehicle-details-my.component.scss'],
})
export class VehicleDetailsMyComponent implements OnInit {
  @Input() tradein: TradeIn;

  constructor() {}

  ngOnInit() {}
}
