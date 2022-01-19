import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditContactPage } from './edit-contact.page';
import { EditContactPageRoutingKeys } from './edit-contact-routing.keys';

const routes: Routes = [
  {
    path: `:${EditContactPageRoutingKeys.PARAM_ID}`,
    children: [
      {
        path: '',
        component: EditContactPage,
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditContactPageRoutingModule {}
