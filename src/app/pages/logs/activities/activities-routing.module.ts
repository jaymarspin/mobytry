import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActivitiesPage } from './activities.page';
import { AcitiviesPageRoutingKeys } from './activities-routing.keys';

const routes: Routes = [
  {
    path: `:${AcitiviesPageRoutingKeys.PARAM_ID}`,
    children: [
      {
        path: '',
        component: ActivitiesPage,
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActivitiesPageRoutingModule {}
