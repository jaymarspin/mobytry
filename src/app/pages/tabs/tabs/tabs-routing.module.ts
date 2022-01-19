import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactListPageRoutingKeys } from '../../contact/contact-list/contact-list-routing.keys';
import { HomePageRoutingKeys } from '../../home/home-routing.keys';
import { OppListPageRoutingKeys } from '../../opportunity/opp-list/opp-list-routing.keys';
import { Tab4RoutingKeys } from '../tab4/tab4-routing.keys';
import { TabRoutingKeys } from './tabs-routing.keys';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: TabRoutingKeys.BASE,
    component: TabsPage,
    children: [
      {
        path: HomePageRoutingKeys.BASE,
        loadChildren: () => import('../../home/home.module').then((m) => m.HomePageModule),
      },
      {
        path: ContactListPageRoutingKeys.BASE,
        loadChildren: () => import('../../contact/contact-list/contact-list.module').then((m) => m.ContactListPageModule),
      },
      {
        path: OppListPageRoutingKeys.BASE,
        loadChildren: () => import('../../opportunity/opp-list/opp-list.module').then((m) => m.OppListPageModule),
      },
      {
        path: Tab4RoutingKeys.BASE,
        loadChildren: () => import('../tab4/tab4.module').then((m) => m.Tab4PageModule),
      },
      {
        path: '',
        redirectTo: `/tabs/${HomePageRoutingKeys.BASE}`,
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: `/tabs/${HomePageRoutingKeys.BASE}`,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
