import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewTestdrivePage } from './view-testdrive.page';
import { ViewTestdrivePageRoutingKeys } from './view-testdrive-routing.keys';

const routes: Routes = [
  {
    path: `:${ViewTestdrivePageRoutingKeys.PARAM_ID}`,
    children: [
      {
        path: '',
        component: ViewTestdrivePage,
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewTestdrivePageRoutingModule {}
