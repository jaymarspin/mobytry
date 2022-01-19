import { Injectable, Inject } from '@angular/core';
import { IEventApi } from 'src/app/interfaces/event-api.interface';
import { EVENT_SERVICE_KEY } from 'src/app/service-providers/dynamic-key.provider';
import { ErrorService } from '../error/error.service';
import { TASK_META_KEY } from 'src/app/service-providers/task-meta.provider';
import { TaskMeta } from 'src/app/models/common/task-meta.model';
import { Event } from 'src/app/models/common/event.model';
import { Moment } from 'moment';
import { TaskFilterModel } from 'src/app/models/common/filter.model';
import { Observable } from 'rxjs';
import { Task } from 'src/app/models/common/task.model';
import { SelectOption } from 'src/app/models/common/select-option.model';
import { EventMeta } from 'src/app/models/common/event-meta.model';
import { EVENT_META_KEY } from 'src/app/service-providers/event-meta.provider';
@Injectable({
  providedIn: 'root',
})
export class CommonEventService {
  constructor(
    @Inject(EVENT_SERVICE_KEY) private eventAPI: IEventApi,
    @Inject(EVENT_META_KEY) private eventMetaParam: EventMeta,
    private errorSrvc: ErrorService
  ) {}

  getEventsOffset(startD: Moment, endD: Moment, taskFilter: TaskFilterModel, search: string, oppId: string): Observable<Event[]> {
    const id = oppId ? oppId : '';
    try {
      return this.eventAPI.getEventsOffset(startD, endD, taskFilter, search, id);
    } catch (e) {
      this.errorSrvc.presentServerErr(e);
    }
  }

  getEvents(startD: Moment, endD: Moment, search: string, oppId: string): Observable<Event[]> {
    const id = oppId ? oppId : '';
    try {
      return this.eventAPI.getEvents(startD, endD, search, id);
    } catch (e) {
      this.errorSrvc.presentServerErr(e);
    }
  }

  getEventById(taskId: string): Observable<Event> {
    try {
      if (taskId && taskId.trim()) {
        return this.eventAPI.getEventById(taskId);
      }
    } catch (e) {
      this.errorSrvc.presentServerErr(e);
    }
  }

  upsertEvent(event: Event): Observable<Event> {
    try {
      return this.eventAPI.upsertEvent(event);
    } catch (e) {
      this.errorSrvc.presentServerErr(e);
    }
  }

  getStatus(): SelectOption[] {
    return this.eventMetaParam.status;
  }

  getAlertTypes(): SelectOption[] {
    return this.eventMetaParam.alert;
  }
}
