import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TradeinsPage } from './tradeins.page';
import { TradeinsPageRoutingKeys } from './tradeins-routing.keys';

const routes: Routes = [
  {
    path: `:${TradeinsPageRoutingKeys.PARAM_ID}`,
    children: [
      {
        path: '',
        component: TradeinsPage,
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TradeinsPageRoutingModule {}
