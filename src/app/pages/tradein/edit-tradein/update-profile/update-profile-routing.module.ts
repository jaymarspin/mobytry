import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UpdateProfilePage } from './update-profile.page';
import { TradeinUpdateProfilePageRoutingKeys } from './update-profile-routing.keys';

const routes: Routes = [
  {
    path: `:${TradeinUpdateProfilePageRoutingKeys.PARAM_ID}/:${TradeinUpdateProfilePageRoutingKeys.OWNER}`,
    children: [
      {
        path: '',
        component: UpdateProfilePage,
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpdateProfilePageRoutingModule {}
