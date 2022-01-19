import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TradeinProfilePage } from './tradein-profile.page';
import { TradeinProfilePageRoutingKeys } from './tradein-profile-routing.keys';

const routes: Routes = [
  {
    path: `:${TradeinProfilePageRoutingKeys.PARAM_ID}/:contact`,
    children: [
      {
        path: '',
        component: TradeinProfilePage,
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TradeinProfilePageRoutingModule {}
