import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CupertinoPane, CupertinoSettings } from 'cupertino-pane';
import { MenuIconModel } from 'src/app/models/common/menu-icons.model';
import { NewLeadsRoutingKeys } from 'src/app/pages/new-leads/new-leads-routing.keys';
import { EditOpportunityPageRoutingKeys } from 'src/app/pages/opportunity/edit-opportunity/edit-opportunity.keys';
import { TasksPageRoutingKeys } from 'src/app/pages/task/tasks-routing.keys';
import { HomeTestdrivePageRoutingKeys } from 'src/app/pages/testdrive/hometestdrives/hometestdrives-routing.keys';
import { TradeinsPageRoutingKeys } from 'src/app/pages/tradein/tradeins/tradeins-routing.keys';
import { MenuService } from 'src/app/services/common/menu/menu.service';
@Component({
  selector: 'app-menu-icons',
  templateUrl: './menu-icons.component.html',
  styleUrls: ['./menu-icons.component.scss'],
})
export class MenuIconsComponent implements OnInit {
  icons: MenuIconModel[];
  swipeUpPane: CupertinoPane;
  swipeMenu: MenuIconModel[];
  segment = 'sales';

  constructor(private router: Router, private menu: MenuService) {}

  ngOnInit() {
    this.initCupertino();
    this.icons = this.menu.getMainMenu();
  }

  initCupertino() {
    const settings: CupertinoSettings = {
      breaks: {
        top: { enabled: true, height: 750 },
        middle: { enabled: false },
        bottom: { enabled: false },
      },
      initialBreak: 'top',
      backdrop: true,
      upperThanTop: false,
      bottomClose: true,
      backdropOpacity: 0.5,
      onBackdropTap: () => this.destroyDrawer(),
      onDidDismiss: () => {
        const tabBar = document.querySelector('ion-tab-bar');
        const fabButton = document.querySelector('ion-fab-button');
        fabButton.style.display = '';
        tabBar.style.display = '';
      },
    };
    this.swipeUpPane = new CupertinoPane('.cupertino-pane', settings);
  }

  destroyDrawer() {
    if (this.swipeUpPane.isPanePresented()) {
      this.swipeUpPane.destroy({ animate: true });
    }
  }

  view(title: string) {
    if (title === 'More') {
      this.swipeMenu = this.menu.getAllMenu();
      this.swipeUpPane.present({ animate: true });
      const tabBar = document.querySelector('ion-tab-bar');
      const fabButton = document.querySelector('ion-fab-button');
      fabButton.style.display = 'none';
      tabBar.style.display = 'none';
    } else if (title === 'Open Opportunity') {
      this.router.navigate([`${EditOpportunityPageRoutingKeys.BASE}/${EditOpportunityPageRoutingKeys.PARAM_ID}`]);
    } else if (title === 'New Contact') {
      this.router.navigate([`${NewLeadsRoutingKeys.BASE}/${NewLeadsRoutingKeys.OPPID}`]);
    } else if (title === 'Test Drive') {
      this.router.navigate([`${HomeTestdrivePageRoutingKeys.BASE}/${HomeTestdrivePageRoutingKeys.OPP_PARAM_ID}`]);
      // this.router.navigate([`${TestdrivePageRoutingKeys.BASE}?${TestdrivePageRoutingKeys.OPP_PARAM_ID}=12345`]); // set oarans
    } else if (title === 'Task') {
      this.router.navigate([`${TasksPageRoutingKeys.BASE}/${TasksPageRoutingKeys.NEW}`]);
    } else if (title === 'Trade-In') {
      this.router.navigate([`${TradeinsPageRoutingKeys.BASE}/${TradeinsPageRoutingKeys.PARAM_ID}`]);
    }
    if (title !== 'More') {
      this.destroyDrawer();
    }
  }
}
