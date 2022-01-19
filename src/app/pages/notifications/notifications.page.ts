import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { from, Observable, Subscription } from 'rxjs';
import { FilterComponent } from './filter/filter.component';
import { NotificationMessageModel } from '../../models/common/notification-message.model';
import { NotificationService } from '../../services/common/notification/notification.service';
import * as _ from 'lodash';
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage {
  notif: NotificationMessageModel[];

  thismonth: any;
  earlier: any;
  private subs: Subscription = new Subscription();
  constructor(
    private modalCtrl: ModalController,
    private translate: TranslateService,
    private loadingCtrl: LoadingController,
    private notification: NotificationService,
    private zone: NgZone,
    private detechange: ChangeDetectorRef
  ) {}

  doRefresh(event) {
    this.getNotifications().then(() => {
      event.target.complete();
    });
  }

  ionViewWillEnter() {
    this.getNotifications();
  }
  ngOnInit(): void {}

  async getNotifications() {
    this.thismonth = new Array();
    this.earlier = new Array();

    await this.subs.add(
      this.notification.retrieveUserNotifications().subscribe((data) => {
        this.notif = data.result;
        this.distinguish();
      })
    );
  }
  distinguish(): void {
    const d = new Date();
    const month = d.getMonth();
    _.forEach(this.notif, (value) => {
      const m = new Date(value.CreatedDate).getMonth();
      if (m === month) this.thismonth.push(value);
      else this.earlier.push(value);
    });
  }
  showFilter() {
    from(
      this.modalCtrl.create({
        component: FilterComponent,
        backdropDismiss: false,
        animated: true,
        cssClass: 'full-screen',
        componentProps: {
          // filterObj: this.filterObj ? Object.assign({}, this.filterObj) : null,
        },
      })
    ).subscribe((modal) => {
      from(modal.onDidDismiss()).subscribe((res: any) => {
        if (res && res.data) {
          // this.filterObj = res.data;
          // this.getOpportunities(this.filterObj);
        }
      });
      modal.present();
    });
  }

  todo() {
    return true;
  }
}
