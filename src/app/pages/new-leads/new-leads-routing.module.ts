import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewLeadsRoutingKeys } from './new-leads-routing.keys';
import { NewLeadsPage } from './new-leads.page';

const routes: Routes = [
  {
    path: `:${NewLeadsRoutingKeys.OPPID}`,
    component: NewLeadsPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewLeadsPageRoutingModule {}
