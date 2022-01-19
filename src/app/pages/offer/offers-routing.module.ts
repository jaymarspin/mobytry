import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OffersPage } from './offers.page';
import { OffersPageRoutingKeys } from './offers-routing.keys';
import { EditOfferPageRoutingKeys } from './edit-offer/edit-offer-routing.keys';
import { ViewOfferPageRoutingKeys } from './view-offer/view-offer-routing.keys';

const routes: Routes = [
  {
    path: `:${OffersPageRoutingKeys.PARAM_ID}`,
    children: [
      {
        path: '',
        component: OffersPage,
        pathMatch: 'full',
      },
      {
        path: `${EditOfferPageRoutingKeys.BASE}`,
        loadChildren: () => import('./edit-offer/edit-offer.module').then((m) => m.EditOfferPageModule),
      },
      {
        path: `${ViewOfferPageRoutingKeys.BASE}`,
        loadChildren: () => import('./view-offer/view-offer.module').then((m) => m.ViewOfferPageModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OffersPageRoutingModule {}
