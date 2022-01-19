import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewOfferPage } from './view-offer.page';
import { ViewOfferPageRoutingKeys } from './view-offer-routing.keys';

const routes: Routes = [
  {
    path: `:${ViewOfferPageRoutingKeys.PARAM_ID}`,
    children: [
      {
        path: '',
        component: ViewOfferPage,
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewOfferPageRoutingModule {}
