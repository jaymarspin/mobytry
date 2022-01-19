import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BookingsPage } from './bookings.page';
import { BookingsPageRoutingKeys } from './bookings-routing.keys';

const routes: Routes = [
  {
    path: `:${BookingsPageRoutingKeys.PARAM_ID}`,
    children: [
      {
        path: '',
        component: BookingsPage,
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BookingsPageRoutingModule {}
