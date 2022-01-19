import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TestdrivesPage } from './testdrives.page';
import { TestdrivePageRoutingKeys } from './testdrive-routing.keys';

const routes: Routes = [
  {
    path: `:${TestdrivePageRoutingKeys.PARAM_ID}`,
    children: [
      {
        path: '',
        component: TestdrivesPage,
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestdrivesPageRoutingModule {}
