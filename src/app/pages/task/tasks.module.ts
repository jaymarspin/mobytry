import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TasksPageRoutingModule } from './tasks-routing.module';

import { TasksPage } from './tasks.page';
import { TranslateModule } from '@ngx-translate/core';
import { FilterTaskComponent } from './component/filter-task/filter-task.component';
import { CalendarViewComponent } from './component/calendar/calendar.component';
import { ListViewComponent } from './component/list-view/list-view.component';
import { NgCalendarModule } from 'ionic2-calendar';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ReactiveFormsModule, TranslateModule, NgCalendarModule, TasksPageRoutingModule],
  declarations: [TasksPage, FilterTaskComponent, CalendarViewComponent, ListViewComponent],
  entryComponents: [],
})
export class TasksPageModule {}
