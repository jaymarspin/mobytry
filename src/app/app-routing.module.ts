import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { BookingsPageRoutingKeys } from './pages/booking/bookings/bookings-routing.keys';
import { ContactRoutes } from './pages/contact/contact.routes';
import { DeliveriesPageRoutingKeys } from './pages/delivery/deliveries/deliveries-routing.keys';
import { LanguageRoutingKeys } from './pages/language/language-routing.keys';
import { LoginPageRoutingKeys } from './pages/login/login-routing.keys';
import { AcitiviesPageRoutingKeys } from './pages/logs/activities/activities-routing.keys';
import { NewLeadsRoutingKeys } from './pages/new-leads/new-leads-routing.keys';
import { NotificationsRoutingKeys } from './pages/notifications/notifications-routing.key';
import { OffersPageRoutingKeys } from './pages/offer/offers-routing.keys';
import { EditOpportunityPageRoutingKeys } from './pages/opportunity/edit-opportunity/edit-opportunity.keys';
import { OpportunityDetailsPageRoutingKeys } from './pages/opportunity/opportunity-details/opportunity-details-routing.keys';
import { ProfileRoutingKeys } from './pages/profile/profile-routing.keys';
import { TasksPageRoutingKeys } from './pages/task/tasks-routing.keys';
import { EditTestdrivePageRoutingKeys } from './pages/testdrive/edit-testdrive/edit-testdrive-routing.keys';
import { TestdrivePageRoutingKeys } from './pages/testdrive/testdrives/testdrive-routing.keys';
import { ViewTestdrivePageRoutingKeys } from './pages/testdrive/view-testdrive/view-testdrive-routing.keys';
import { TradeinProfilePageRoutingKeys } from './pages/tradein/edit-tradein/tradein-profile/tradein-profile-routing.keys';
import { TradeinUpdateProfilePageRoutingKeys } from './pages/tradein/edit-tradein/update-profile/update-profile-routing.keys';
import { TradeinsPageRoutingKeys } from './pages/tradein/tradeins/tradeins-routing.keys';
import { TradeinViewProfilePageRoutingKeys } from './pages/tradein/view-tradein/view-tradein-routing.keys';
import { AuthGuard } from './services/common/auth/guard/auth.guard';
import { HomeTestdrivePageRoutingKeys } from './pages/testdrive/hometestdrives/hometestdrives-routing.keys';
const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/tabs/tabs/tabs.module').then((m) => m.TabsPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: ProfileRoutingKeys.BASE,
    loadChildren: () => import('./pages/profile/profile.module').then((m) => m.ProfilePageModule),
    canActivate: [AuthGuard],
  },
  ...ContactRoutes,
  {
    path: LanguageRoutingKeys.BASE,
    loadChildren: () => import('./pages/language/language.module').then((m) => m.LanguagePageModule),
    canActivate: [AuthGuard],
  },
  {
    path: NotificationsRoutingKeys.BASE,
    loadChildren: () => import('./pages/notifications/notifications.module').then((m) => m.NotificationsPageModule),
    canActivate: [AuthGuard],
  },

  {
    path: NewLeadsRoutingKeys.BASE,
    loadChildren: () => import('./pages/new-leads/new-leads.module').then((m) => m.NewLeadsPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: OpportunityDetailsPageRoutingKeys.BASE,
    loadChildren: () => import('./pages/opportunity/opportunity-details/opportunity-details.module').then((m) => m.OpportunityDetailsPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: TestdrivePageRoutingKeys.BASE,
    loadChildren: () => import('./pages/testdrive/testdrives/testdrives.module').then((m) => m.TestdrivesPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: HomeTestdrivePageRoutingKeys.BASE,
    loadChildren: () => import('./pages/testdrive/hometestdrives/hometestdrives.module').then((m) => m.HometestdrivesPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: TasksPageRoutingKeys.BASE,
    loadChildren: () => import('./pages/task/tasks.module').then((m) => m.TasksPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: OffersPageRoutingKeys.BASE,
    loadChildren: () => import('./pages/offer/offers.module').then((m) => m.OffersPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: DeliveriesPageRoutingKeys.BASE,
    loadChildren: () => import('./pages/delivery/deliveries/deliveries.module').then((m) => m.DeliveriesPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: BookingsPageRoutingKeys.BASE,
    loadChildren: () => import('./pages/booking/bookings/bookings.module').then((m) => m.BookingsPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: AcitiviesPageRoutingKeys.BASE,
    loadChildren: () => import('./pages/logs/activities/activities.module').then((m) => m.ActivitiesPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: ViewTestdrivePageRoutingKeys.BASE,
    loadChildren: () => import('./pages/testdrive/view-testdrive/view-testdrive.module').then((m) => m.ViewTestdrivePageModule),
    canActivate: [AuthGuard],
  },
  {
    path: EditTestdrivePageRoutingKeys.BASE,
    loadChildren: () => import('./pages/testdrive/edit-testdrive/edit-testdrive.module').then((m) => m.EditTestdrivePageModule),
    canActivate: [AuthGuard],
  },
  {
    path: LoginPageRoutingKeys.BASE,
    loadChildren: () => import('./pages/login/login.module').then((m) => m.LoginPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: EditOpportunityPageRoutingKeys.BASE,
    loadChildren: () => import('./pages/opportunity/edit-opportunity/edit-opportunity.module').then((m) => m.EditOpportunityPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: TradeinsPageRoutingKeys.BASE,
    loadChildren: () => import('./pages/tradein/tradeins/tradeins.module').then((m) => m.TradeinsPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: TradeinViewProfilePageRoutingKeys.BASE,
    loadChildren: () => import('./pages/tradein/view-tradein/view-tradein.module').then((m) => m.ViewTradeinPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: TradeinUpdateProfilePageRoutingKeys.BASE,
    loadChildren: () => import('./pages/tradein/edit-tradein/update-profile/update-profile.module').then((m) => m.UpdateProfilePageModule),
    canActivate: [AuthGuard],
  },
  {
    path: TradeinProfilePageRoutingKeys.BASE,
    loadChildren: () => import('./pages/tradein/edit-tradein/tradein-profile/tradein-profile.module').then((m) => m.TradeinProfilePageModule),
    canActivate: [AuthGuard],
  },

  {
    path: 'hometestdrives',
    loadChildren: () => import('./pages/testdrive/hometestdrives/hometestdrives.module').then((m) => m.HometestdrivesPageModule),
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
