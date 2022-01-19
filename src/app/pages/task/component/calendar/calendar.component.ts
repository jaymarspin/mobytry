import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { CalendarComponent } from 'ionic2-calendar';
import { CalendarMode, Step } from 'ionic2-calendar/calendar';
import { forkJoin, from, of } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import { Event } from 'src/app/models/common/event.model';
import { Task } from 'src/app/models/common/task.model';
import { EditEventPageRoutingKeys } from '../../edit-event/edit-event-routing.keys';
import { EditTaskPageRoutingKeys } from '../../edit-task/edit-task-routing.keys';
import { TasksPageRoutingKeys } from '../../tasks-routing.keys';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarViewComponent implements OnInit, OnChanges {
  @Input() tasks: Task[];
  @Input() events: Event[];
  @Input() oppId: string;
  @Output() month = new EventEmitter<string>();
  eventSource = [];
  viewTitle: string;

  calendar = {
    mode: 'month' as CalendarMode,
    currentDate: new Date(),
    step: 30 as Step,
    startingDayWeek: 1,
  };

  selectedDate: Date;
  startDate: any;
  endDate: any;

  @ViewChild(CalendarComponent) myCal: CalendarComponent;

  constructor(private router: Router, private translate: TranslateService, private actionSheet: ActionSheetController) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.plotEvent();
  }

  ngOnInit() {}

  next() {
    this.myCal.slideNext();
  }

  back() {
    this.myCal.slidePrev();
  }

  onViewTitleChanged(title: string) {
    this.viewTitle = title;
    this.month.emit(title);
  }

  async onEventSelected(event) {}

  plotEvent() {
    const events = [];
    if (this.tasks) {
      this.tasks.forEach((el) => {
        let startDate = new Date(el.DueDate);
        startDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 1);
        const endDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
        events.push({
          // Calendar Information
          title: el.TaskName,
          startTime: startDate,
          endTime: endDate,
          allDay: true,

          // Display Information
          Id: el.Id,
          ContactName: el.ContactName,
          Notes: el.Notes,
          isComplete: el.isComplete,
          ContactId: el.ContactId,
          OpportunityId: el.OpportunityId,
          CreatedDate: el.CreatedDate,
          SourceName: el.SourceName,
          Category: el.Category,
          Status: el.Status,
          Alert: el.Alert,
        });
      });
    }
    if (this.events) {
      this.events.forEach((el) => {
        const startDate = new Date(el.StartDate ? el.StartDate : el.EndDate);
        const endDate = new Date(el.EndDate);
        const startDT = new Date(
          startDate.getFullYear(),
          startDate.getMonth(),
          startDate.getDate(),
          startDate.getHours(),
          startDate.getMinutes(),
          startDate.getSeconds(),
          startDate.getMilliseconds()
        );
        const endDT = new Date(
          endDate.getFullYear(),
          endDate.getMonth(),
          endDate.getDate() + (el.AllDay ? 1 : 0),
          endDate.getHours(),
          endDate.getMinutes(),
          endDate.getSeconds(),
          endDate.getMilliseconds()
        );
        events.push({
          // Calendar Information
          title: el.TaskName,
          startTime: startDT,
          endTime: endDT,
          allDay: el.AllDay,

          // Display Information
          Id: el.Id,
          ContactId: el.ContactId,
          OpportunityId: el.OpportunityId,
          CreatedDate: el.CreatedDate,
          ContactName: el.ContactName,
          SourceName: el.SourceName,
          Category: el.Category,
          Status: el.Status,
          Alert: el.Alert,
          Notes: el.Notes,
          isComplete: el.isComplete,
        });
      });
    }
    this.eventSource = events;
  }

  async eventSelected(item) {
    const oppId = this.oppId ? this.oppId : TasksPageRoutingKeys.PARAM_ID;
    if (item?.Category === 'Task') {
      this.router.navigate([`${TasksPageRoutingKeys.BASE}/${oppId}/${EditTaskPageRoutingKeys.BASE}/${item.Id}`]);
    } else {
      this.router.navigate([`${TasksPageRoutingKeys.BASE}/${oppId}/${EditEventPageRoutingKeys.BASE}/${item.Id}`]);
    }
  }

  add() {
    const state = new Object();
    state[EditTaskPageRoutingKeys.STATE_OPPID] = this.oppId;
    const navigationExtras: NavigationExtras = {
      state,
    };
    const oppId = this.oppId ? this.oppId : TasksPageRoutingKeys.PARAM_ID;
    const btns = [];
    from(this.actionSheet.create())
      .pipe(
        mergeMap((alert) => {
          return forkJoin([
            this.translate.get('TasksPage_PleaseSelect').pipe(
              tap((e) => {
                alert.header = e;
              })
            ),
            this.translate.get('TasksPage_CreateEvent').pipe(
              tap((e) => {
                btns.push({
                  text: e,
                  handler: () => {
                    this.router.navigate(
                      [`${TasksPageRoutingKeys.BASE}/${oppId}/${EditEventPageRoutingKeys.BASE}/${EditEventPageRoutingKeys.PARAM_ID}`],
                      navigationExtras
                    );
                  },
                });
              })
            ),
            this.translate.get('TasksPage_CreateTask').pipe(
              tap((e) => {
                btns.push({
                  text: e,
                  handler: () => {
                    this.router.navigate(
                      [`${TasksPageRoutingKeys.BASE}/${oppId}/${EditTaskPageRoutingKeys.BASE}/${EditTaskPageRoutingKeys.PARAM_ID}`],
                      navigationExtras
                    );
                  },
                });
              })
            ),
          ]).pipe(
            mergeMap((e) => {
              return of(alert);
            })
          );
        })
      )
      .subscribe((alert) => {
        alert.buttons = btns;
        alert.present();
      });
  }

  setStatus(e) {}
}
