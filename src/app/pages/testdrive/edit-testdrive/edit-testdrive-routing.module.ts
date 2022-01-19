import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditTestdrivePage } from './edit-testdrive.page';
import { EditTestdrivePageRoutingKeys } from './edit-testdrive-routing.keys';

const routes: Routes = [
  {
    path: `:${EditTestdrivePageRoutingKeys.PARAM_ID}`,
    children: [
      {
        path: '',
        component: EditTestdrivePage,
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditTestdrivePageRoutingModule {}
