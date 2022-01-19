import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OppListPage } from './opp-list.page';

const routes: Routes = [
  {
    path: '',
    component: OppListPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OppListPageRoutingModule {}
