import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeliveriesPage } from './deliveries.page';
import { DeliveriesPageRoutingKeys } from './deliveries-routing.keys';

const routes: Routes = [
  {
    path: `:${DeliveriesPageRoutingKeys.PARAM_ID}`,
    children: [
      {
        path: '',
        component: DeliveriesPage,
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeliveriesPageRoutingModule {}
