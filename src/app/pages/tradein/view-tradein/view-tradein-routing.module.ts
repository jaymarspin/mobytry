import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewTradeinPage } from './view-tradein.page';
import { TradeinViewProfilePageRoutingKeys } from './view-tradein-routing.keys';

const routes: Routes = [
  {
    path: `:${TradeinViewProfilePageRoutingKeys.PARAM_ID}`,
    children: [
      {
        path: '',
        component: ViewTradeinPage,
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewTradeinPageRoutingModule {}
