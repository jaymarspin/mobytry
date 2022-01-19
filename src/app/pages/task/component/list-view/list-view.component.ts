import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Task } from 'src/app/models/common/task.model';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { TasksPageRoutingKeys } from '../../tasks-routing.keys';
import { EditTaskPageRoutingKeys } from '../../edit-task/edit-task-routing.keys';
import { TranslateService } from '@ngx-translate/core';
import { ActionSheetController, LoadingController, ModalController } from '@ionic/angular';
import { from, forkJoin, of } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import { EditEventPageRoutingKeys } from '../../edit-event/edit-event-routing.keys';
import { TaskFilterModel } from 'src/app/models/common/filter.model';
import { CommonTaskService } from 'src/app/services/common/task/task.service';
import * as moment from 'moment';
import { Event } from 'src/app/models/common/event.model';
import { CommonEventService } from 'src/app/services/common/event/event.service';

@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.scss'],
})
export class ListViewComponent implements OnInit, OnChanges {
  @Input() oppId: string;
  @Input() filterObj: TaskFilterModel;
  @Input() search: string;
  tasks: CategorizedTasks[] = [];

  constructor(
    private router: Router,
    private translate: TranslateService,
    private actionSheet: ActionSheetController,
    private taskSrvc: CommonTaskService,
    private loadingCtrl: LoadingController,
    private eventSrvc: CommonEventService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnInit() {
    console.log(this.tasks);
    this.tasks = [];
    this.getEventsAndTasks(null);
  }

  edit(item) {
    const oppId = this.oppId ? this.oppId : TasksPageRoutingKeys.PARAM_ID;
    if (item?.Type === 'Task') {
      this.router.navigate([`${TasksPageRoutingKeys.BASE}/1/${EditTaskPageRoutingKeys.BASE}/${item.Id}`]);
    } else {
      this.router.navigate([`${EditEventPageRoutingKeys.BASE}/1/${EditEventPageRoutingKeys.BASE}/${item.Id}`]);
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

  setStatus(task: Task) {}

  getEventsAndTasks(ev: any) {
    let tasks: Task[] = [];
    let events: Event[] = [];
    this.translate
      .get('Common_Loading')
      .pipe(
        mergeMap((lang) => {
          return from(
            this.loadingCtrl.create({
              message: lang,
            })
          );
        }),
        mergeMap((loading) => {
          loading.present();
          return this.taskSrvc.getTasksOffset(null, null, this.filterObj, this.search, this.oppId).pipe(
            tap((e) => {
              tasks = e;
            }),
            mergeMap(() => {
              return this.eventSrvc.getEventsOffset(null, null, this.filterObj, this.search, this.oppId).pipe(
                tap(
                  (e) => {
                    events = e;
                    loading.dismiss();
                  },
                  (err) => {
                    loading.dismiss();
                  }
                )
              );
            })
          );
        })
      )
      .subscribe((e) => {
        if (tasks) {
          tasks.forEach((el) => {
            const date = el.StartDate ? el.StartDate : el.DueDate;
            if (this.tasks.length < 1) {
              this.tasks.push({
                header: moment(date).format('MMM YYYY'),
                events: [],
              });
              this.tasks[this.tasks.length - 1].events.push(el);
            } else {
              if (moment(el.StartDate).format('MMM YYYY').toLocaleLowerCase() === this.tasks[this.tasks.length - 1].header.toLocaleLowerCase()) {
                this.tasks[this.tasks.length - 1].events.push(el);
              } else {
                this.tasks.push({
                  header: moment(date).format('MMM YYYY'),
                  events: [],
                });
                this.tasks[this.tasks.length - 1].events.push(el);
              }
            }
          });
        }
        if (events) {
          events.forEach((el) => {
            const date = el.StartDate ? el.StartDate : el.EndDate;
            if (this.tasks.length < 1) {
              this.tasks.push({
                header: moment(date).format('MMM YYYY'),
                events: [],
              });
              this.tasks[this.tasks.length - 1].events.push(el);
            } else {
              if (moment(el.StartDate).format('MMM YYYY').toLocaleLowerCase() === this.tasks[this.tasks.length - 1].header.toLocaleLowerCase()) {
                this.tasks[this.tasks.length - 1].events.push(el);
              } else {
                this.tasks.push({
                  header: moment(date).format('MMM YYYY'),
                  events: [],
                });
                this.tasks[this.tasks.length - 1].events.push(el);
              }
            }
          });
        }
        if (ev) {
          ev.target.complete();
        }
        console.log(this.tasks);
      });
  }

  loadData(event) {
    this.search = this.search && this.search.trim() ? this.search : null;
    this.getEventsAndTasks(event);
  }
}

class CategorizedTasks {
  header: string;
  events: Task[];
}
