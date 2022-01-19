import { Component, OnInit } from '@angular/core';
import { Subscription, from } from 'rxjs';
import { TaskFilterModel } from 'src/app/models/common/filter.model';
import { CommonTaskService } from 'src/app/services/common/task/task.service';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { TasksPageRoutingKeys } from './tasks-routing.keys';
import { mergeMap, tap } from 'rxjs/operators';
import { Task } from 'src/app/models/common/task.model';
import { FilterTaskComponent } from './component/filter-task/filter-task.component';
import * as moment from 'moment';
import { Event } from 'src/app/models/common/event.model';
import { CommonEventService } from 'src/app/services/common/event/event.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
})
export class TasksPage implements OnInit {
  private subs = new Subscription();
  tasks: Task[];
  events: Event[];
  oppId: string;
  filterObj: TaskFilterModel;
  searchInput: string;
  isListView = false;
  currDate: string;

  constructor(
    private route: ActivatedRoute,
    private taskSrvc: CommonTaskService,
    private eventSrvc: CommonEventService,
    private translate: TranslateService,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.subs.add(this.parseURL());
  }

  parseURL() {
    return this.route.paramMap.subscribe((params) => {
      this.oppId = params.get(TasksPageRoutingKeys.PARAM_ID);
      if (this.oppId === TasksPageRoutingKeys.NEW) {
        this.oppId = '';
      }
      this.getEventsAndTasks().then(() => {});
    });
  }

  async getEventsAndTasks(filter?: TaskFilterModel) {
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
          const startOfMonth = moment().startOf('month');
          const endOfMonth = moment().endOf('month');
          return this.taskSrvc.getTasks(startOfMonth, endOfMonth, this.searchInput, this.oppId).pipe(
            tap((e) => {
              this.tasks = e;
            }),
            mergeMap(() => {
              return this.eventSrvc.getEvents(startOfMonth, endOfMonth, this.searchInput, this.oppId).pipe(
                tap(
                  (e) => {
                    this.events = e;
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
      .subscribe();
  }

  switchView() {
    this.isListView = !this.isListView;
  }

  dateChanged(d: string) {
    if (!d) {
      return;
    }

    this.currDate = d;
    this.getEventsAndTasks();
  }

  showFilter() {
    from(
      this.modalCtrl.create({
        component: FilterTaskComponent,
        backdropDismiss: false,
        animated: true,
        cssClass: 'full-screen',
        componentProps: {
          filterObj: this.filterObj ? Object.assign({}, this.filterObj) : null,
        },
      })
    ).subscribe((modal) => {
      from(modal.onDidDismiss()).subscribe((res: any) => {
        if (res && res.data) {
          this.filterObj = res.data;
          this.getEventsAndTasks(this.filterObj);
        }
      });
      modal.present();
    });
  }

  search() {
    this.getEventsAndTasks();
  }
}
