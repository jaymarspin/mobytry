import { Component, OnInit, Input } from '@angular/core';
import { Opportunity } from 'src/app/models/common/opportunity.model';
import { ContactModel } from 'src/app/models/common/contact.model';
import { EditOpportunityPageRoutingKeys } from 'src/app/pages/opportunity/edit-opportunity/edit-opportunity.keys';
import { NavigationExtras, Router } from '@angular/router';
import { OpportunityDetailsPageRoutingKeys } from 'src/app/pages/opportunity/opportunity-details/opportunity-details-routing.keys';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-opportunity-segment',
  templateUrl: './opportunity-segment.component.html',
  styleUrls: ['./opportunity-segment.component.scss'],
})
export class OpportunitySegmentComponent implements OnInit {
  @Input() opp: Opportunity[];
  @Input() contact: ContactModel;
  countryCode = environment.countryCode;

  constructor(private router: Router) {}

  ngOnInit() {}

  getColor(warmth: number) {
    if (warmth === 100) {
      return 'danger';
    } else if (warmth < 1) {
      return 'secondary';
    } else {
      return 'warning';
    }
  }

  getFavIcon(opp: Opportunity) {
    if (opp.Flag) {
      return 'star';
    } else {
      return 'star-outline';
    }
  }

  addOpp() {
    const state = new Object();
    const opp = new Opportunity();
    opp.ContactId = this.contact.Id;
    opp.ContactName = this.contact.Name;
    state[EditOpportunityPageRoutingKeys.STATE_OPP] = opp;
    const navigationExtras: NavigationExtras = {
      state,
    };
    this.router.navigate([`${EditOpportunityPageRoutingKeys.BASE}/${EditOpportunityPageRoutingKeys.PARAM_ID}`], navigationExtras);
  }

  viewOpp(id: string) {
    this.router.navigate([`${OpportunityDetailsPageRoutingKeys.BASE}/` + id]);
  }
}
