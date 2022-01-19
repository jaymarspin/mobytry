import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditOpportunityPage } from './edit-opportunity.page';
import { EditOfferPageRoutingKeys } from '../../offer/edit-offer/edit-offer-routing.keys';

const routes: Routes = [
  {
    path: `:${EditOfferPageRoutingKeys.PARAM_ID}`,
    children: [
      {
        path: '',
        component: EditOpportunityPage,
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditOpportunityPageRoutingModule {}
