import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditTaskPage } from './edit-task.page';
import { EditTaskPageRoutingKeys } from './edit-task-routing.keys';

const routes: Routes = [
  {
    path: `:${EditTaskPageRoutingKeys.PARAM_ID}`,
    children: [
      {
        path: '',
        component: EditTaskPage,
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditTaskPageRoutingModule {}
