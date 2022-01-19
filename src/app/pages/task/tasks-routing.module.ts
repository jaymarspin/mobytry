import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TasksPage } from './tasks.page';
import { TasksPageRoutingKeys } from './tasks-routing.keys';
import { EditTaskPageRoutingKeys } from './edit-task/edit-task-routing.keys';
import { EditEventPageRoutingKeys } from './edit-event/edit-event-routing.keys';

const routes: Routes = [
  {
    path: `:${TasksPageRoutingKeys.PARAM_ID}`,
    children: [
      {
        path: '',
        component: TasksPage,
        pathMatch: 'full',
      },
      {
        path: `${EditTaskPageRoutingKeys.BASE}`,
        loadChildren: () => import('./edit-task/edit-task.module').then((m) => m.EditTaskPageModule),
      },
      {
        path: `${EditEventPageRoutingKeys.BASE}`,
        loadChildren: () => import('./edit-event/edit-event.module').then((m) => m.EditEventPageModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TasksPageRoutingModule {}
