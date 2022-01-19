import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HometestdrivesPage } from './hometestdrives.page';
import { HomeTestdrivePageRoutingKeys } from './hometestdrives-routing.keys';
const routes: Routes = [
  {
    path: `:${HomeTestdrivePageRoutingKeys.OPP_PARAM_ID}`,
    children: [
      {
        path: '',
        component: HometestdrivesPage,
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HometestdrivesPageRoutingModule {}
