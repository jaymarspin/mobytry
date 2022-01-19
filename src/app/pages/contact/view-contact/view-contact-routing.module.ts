import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewContactPage } from './view-contact.page';
import { ViewContactPageRoutingKeys } from './view-contact-routing.keys';

const routes: Routes = [
  {
    path: `:${ViewContactPageRoutingKeys.PARAM_ID}`,
    children: [
      {
        path: '',
        component: ViewContactPage,
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewContactPageRoutingModule {}
