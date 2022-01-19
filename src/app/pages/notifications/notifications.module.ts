import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { NotificationsPageRoutingModule } from './notifications-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { NotificationsPage } from './notifications.page';
import { FilterComponent } from './filter/filter.component';
import { MomentModule } from 'ngx-moment';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    ReactiveFormsModule,
    MomentModule.forRoot({
      relativeTimeThresholdOptions: {
        'm': 59,
      },
    }),
    NotificationsPageRoutingModule,
  ],
  declarations: [NotificationsPage, FilterComponent],
})
export class NotificationsPageModule {}
