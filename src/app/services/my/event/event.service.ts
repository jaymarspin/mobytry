import { Injectable } from '@angular/core';
import { IEventApi } from 'src/app/interfaces/event-api.interface';
import { Observable, of } from 'rxjs';
import { Moment } from 'moment';
import { Event } from 'src/app/models/common/event.model';
import { TaskFilterModel } from 'src/app/models/common/filter.model';
import { User } from 'src/app/models/common/user.model';
import { ErrorService } from '../../common/error/error.service';
import { ApiService } from '../../common/api/api.service';
import { ApiMY } from '../api/api-my.service';
import { AuthenticationService } from '../../common/auth/auth.service';
import { Query } from 'src/app/models/sg/query.model';
import { EventSF } from './event.class';
import { filter, map, tap, catchError } from 'rxjs/operators';
import { DBResult } from 'src/app/models/sg/dbresult.model';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class EventServiceMY implements IEventApi {
  private user: User;
  private currEvents: Event[] = [];
  private offset = 0;

  constructor(private errorSrvc: ErrorService, private api: ApiService, private apiSettings: ApiMY, private auth: AuthenticationService) {
    this.offset = 0;
    this.currEvents = [];
    this.auth.subUser().subscribe((u) => {
      this.user = u;
    });
  }

  getEvents(startD: Moment, endD: Moment, search: string, oppId: string): Observable<Event[]> {
    if (!this.user || !this.user.userId) {
      return of([]);
    }
    const startDate = startD;
    const endDate = endD;
    let query =
      `${EventSF.queryEvent()} WHERE OwnerId = '${this.user.userId}'
       AND ` + `ActivityDate >= ${startDate.format('YYYY-MM-DD')} AND ActivityDate <= ${endDate.format('YYYY-MM-DD')}`;
    query = query + `ORDER BY ActivityDate`;
    return this.api.get<Query>(this.apiSettings.getQueryUrl(query)).pipe(
      filter((res) => res != null && res.records != null && res.records.length >= 0),
      map((res) => res.records.map(EventSF.parseSF)),
      tap((curRes) => {
        console.log(curRes);
      }),
      catchError((err) => {
        this.errorSrvc.presentServerErr(err);
        throw err;
      })
    );
  }

  getEventById(taskId: string): Observable<Event> {
    if (!taskId) {
      throw new Error('Invalid Id.');
    }
    const query = `${EventSF.queryEvent()} WHERE Id = '${taskId}'`;
    return this.api.get<Query>(this.apiSettings.getQueryUrl(query)).pipe(
      map((res) => {
        if (!res || !res.records || res.records.length <= 0) {
          return [];
        }
        return res.records.map(EventSF.parseSF);
      }),
      map((events: Event[]) => {
        return events && events.length > 0 ? events[0] : null;
      }),
      catchError((err) => {
        this.errorSrvc.presentServerErr(err);
        throw err;
      })
    );
  }

  upsertEvent(task: Event): Observable<Event> {
    let obs: Observable<DBResult>;
    const req = {
      Id: task.Id,
      Subject: task?.TaskName,
      Status: task?.Status,
      Description: task?.Notes,
      WhoId: task.ContactId,
      ActivityDate: moment(task.EndDate).toDate(),
      DurationInMinutes: 60,
    };
    if (task.Id) {
      obs = this.api.patch<DBResult>(this.apiSettings.getUpdateUrl(EventSF.SF_OBJ, task.Id), req);
    } else {
      obs = this.api.post<DBResult>(this.apiSettings.getInsertUrl(EventSF.SF_OBJ), req);
    }
    return obs.pipe(
      map((res) => {
        console.log(res);
        if (res) {
          task.Id = res.id;
        }
        return task;
      }),
      catchError((err) => {
        this.errorSrvc.presentServerErr(err);
        throw err;
      })
    );
  }

  getEventsOffset(startD: Moment, endD: Moment, taskFilter: TaskFilterModel, search: string, oppId: string): Observable<Event[]> {
    if (!this.user || !this.user.userId) {
      return of([]);
    }
    let query = `${EventSF.queryEvent()} WHERE OwnerId = '${this.user.userId}'`;
    if (taskFilter?.startDate || taskFilter?.endDate) {
      const startDate = taskFilter?.startDate ? moment(taskFilter.startDate) : moment();
      const endDate = taskFilter?.endDate ? moment(taskFilter.endDate) : moment();
      query = query + `AND ` + `ActivityDate >= ${startDate.format('YYYY-MM-DD')} AND ActivityDate <= ${endDate.format('YYYY-MM-DD')} `;
    }
    if (search) {
      query = query + `AND Name LIKE '%${search}%' `;
    }
    query = query + `ORDER BY ActivityDate LIMIT 10 OFFSET ${this.offset}`;
    return this.api.get<Query>(this.apiSettings.getQueryUrl(query)).pipe(
      filter((res) => res != null && res.records != null && res.records.length >= 0),
      map((res) => res.records.map(EventSF.parseSF)),
      tap((arr) => {
        arr.forEach((tasks) => {
          this.currEvents.push(tasks);
        });
        this.offset = this.offset + arr.length;
      }),
      map((arr) => {
        return this.currEvents;
      }),
      catchError((err) => {
        this.errorSrvc.presentServerErr(err);
        throw err;
      })
    );
  }
}
