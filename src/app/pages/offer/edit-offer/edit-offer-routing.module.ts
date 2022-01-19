import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditOfferPage } from './edit-offer.page';
import { EditOfferPageRoutingKeys } from './edit-offer-routing.keys';

const routes: Routes = [
  {
    path: `:${EditOfferPageRoutingKeys.PARAM_ID}`,
    children: [
      {
        path: '',
        component: EditOfferPage,
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditOfferPageRoutingModule {}
