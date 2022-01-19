import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ContactListPageRoutingKeys } from '../../contact/contact-list/contact-list-routing.keys';
import { SearchPageRoutingKeys } from '../../contact/search/search-routing.keys';
import { HomePageRoutingKeys } from '../../home/home-routing.keys';
import { OppListPageRoutingKeys } from '../../opportunity/opp-list/opp-list-routing.keys';
import { TasksPageRoutingKeys } from '../../task/tasks-routing.keys';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage {
  constructor(private navCtrl: NavController) {}
  tabs = [
    {
      tabUrl: HomePageRoutingKeys.BASE,
      icon: 'home',
    },
    {
      tabUrl: ContactListPageRoutingKeys.BASE,
      icon: 'people',
    },
    {
      tabUrl: OppListPageRoutingKeys.BASE,
      icon: 'bulb',
    },
    {
      tabUrl: TasksPageRoutingKeys.BASE,
      icon: 'pulse',
    },
  ];

  goToSearch() {
    this.navCtrl.navigateForward(SearchPageRoutingKeys.BASE);
  }
}
