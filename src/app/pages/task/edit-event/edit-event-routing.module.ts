import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditEventPage } from './edit-event.page';
import { EditEventPageRoutingKeys } from './edit-event-routing.keys';

const routes: Routes = [
  {
    path: `:${EditEventPageRoutingKeys.PARAM_ID}`,
    children: [
      {
        path: '',
        component: EditEventPage,
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditEventPageRoutingModule {}
