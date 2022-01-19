import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OpportunityDetailsPage } from './opportunity-details.page';
import { OpportunityDetailsPageRoutingKeys } from './opportunity-details-routing.keys';

const routes: Routes = [
  {
    path: `:${OpportunityDetailsPageRoutingKeys.PARAM_ID}`,
    children: [
      {
        path: '',
        component: OpportunityDetailsPage,
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OpportunityDetailsPageRoutingModule {}
