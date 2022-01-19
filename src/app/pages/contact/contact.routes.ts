import { Routes } from '@angular/router';
import { EditContactPageRoutingKeys } from './../../pages/contact/edit-contact/edit-contact-routing.keys';
import { SearchPageRoutingKeys } from './../../pages/contact/search/search-routing.keys';
import { ViewContactPageRoutingKeys } from './../../pages/contact/view-contact/view-contact-routing.keys';
import { AuthGuard } from './../../services/common/auth/guard/auth.guard';
import { ContactListPageRoutingKeys } from './contact-list/contact-list-routing.keys';

export const ContactRoutes: Routes = [
  {
    path: EditContactPageRoutingKeys.BASE,
    loadChildren: () => import('./../../pages/contact/edit-contact/edit-contact.module').then((m) => m.EditContactPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: ViewContactPageRoutingKeys.BASE,
    loadChildren: () => import('./../../pages/contact/view-contact/view-contact.module').then((m) => m.ViewContactPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: ContactListPageRoutingKeys.BASE,
    loadChildren: () => import('./../../pages/contact/contact-list/contact-list.module').then((m) => m.ContactListPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: SearchPageRoutingKeys.BASE,
    loadChildren: () => import('./../../pages/contact/search/search.module').then((m) => m.SearchPageModule),
    canActivate: [AuthGuard],
  },
];
