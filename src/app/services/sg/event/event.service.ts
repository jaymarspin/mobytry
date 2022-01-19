import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Moment } from 'moment';
import { Observable, of } from 'rxjs';
import { catchError, filter, map, tap } from 'rxjs/operators';
import { IEventApi } from 'src/app/interfaces/event-api.interface';
import { Event } from 'src/app/models/common/event.model';
import { TaskFilterModel } from 'src/app/models/common/filter.model';
import { User } from 'src/app/models/common/user.model';
import { DBResult } from 'src/app/models/sg/dbresult.model';
import { Query } from 'src/app/models/sg/query.model';
import { ApiService } from '../../common/api/api.service';
import { AuthenticationService } from '../../common/auth/auth.service';
import { ErrorService } from '../../common/error/error.service';
import { ApiSG } from '../api/api-sg.service';

@Injectable({
  providedIn: 'root',
})
export class EventServiceSG implements IEventApi {
  private user: User;
  private currEvents: Event[] = [];
  private offset = 0;

  SF_OBJ = 'Event';

  constructor(private errorSrvc: ErrorService, private api: ApiService, private apiSettings: ApiSG, private auth: AuthenticationService) {
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
      `${this.queryEvent()} WHERE OwnerId = '${this.user.userId}'
       AND ` + `ActivityDate >= ${startDate.format('YYYY-MM-DD')} AND ActivityDate <= ${endDate.format('YYYY-MM-DD')}`;
    query = query + `ORDER BY ActivityDate`;
    return this.api.get<Query>(this.apiSettings.getQueryUrl(query)).pipe(
      filter((res) => res != null && res.records != null && res.records.length >= 0),
      map((res) => res.records.map(this.parseSF)),
      tap((curRes) => {
        console.log(curRes);
      }),
      catchError((err) => {
        this.errorSrvc.presentServerErr(err);
        throw err;
      })
    );
  }

  queryEvent(): string {
    return `SELECT Id, OwnerId, WhoId, Who.Name, Location, CRM_Indication__c, StartDateTime, EndDate, ActivityDate, EndDateTime,
            Subject, Description, WhatId, CreatedDate, IsAllDayEvent FROM ${this.SF_OBJ}`;
  }

  // return (
  //   'SELECT Id, WhoId, ActivityDate, Subject, Description, CRM_Indication__c, Status, IsClosed, WhatId, Follow_Up_Offer__c, ' +
  //   `Sales_Offer_Reference_PL__c, RecordTypeId, CreatedDate FROM ${this.SF_OBJ}`
  // );

  parseSF(apiRes): Event {
    console.log(apiRes);
    delete apiRes.attributes;
    const event = new Event();
    event.Id = apiRes.Id;
    event.ContactId = apiRes.WhoId;
    event.OpportunityId = null;
    event.CreatedDate = apiRes.CreatedDate;
    event.ContactName = apiRes.Who?.Name;
    event.SourceId = null;
    event.SourceName = null;
    event.StartDate = moment(apiRes.StartDateTime).format('DD MMM YYYY HH:mm');
    event.EndDate = moment(apiRes.EndDateTime).format('DD MMM YYYY HH:mm');
    event.TaskName = apiRes.Subject;
    event.Category = 'Event';
    event.Status = null;
    event.AllDay = apiRes.IsAllDayEvent;
    event.Alert = null;
    event.Notes = apiRes.Description;
    event.isComplete = apiRes.IsClosed ? true : false;

    return event;
  }

  getEventById(taskId: string): Observable<Event> {
    if (!taskId) {
      throw new Error('Invalid Id.');
    }

    const query = `${this.queryEvent()} WHERE Id = '${taskId}'`;
    return this.api.get<Query>(this.apiSettings.getQueryUrl(query)).pipe(
      map((res) => {
        // console.log(res)
        if (!res || !res.records || res.records.length <= 0) {
          return [];
        }
        return res.records.map(this.parseSF);
      }),
      map((events: Event[]) => {
        console.log(events[0]);
        return events && events.length > 0 ? events[0] : null;
      }),
      catchError((err) => {
        this.errorSrvc.presentServerErr(err);
        throw err;
      })
    );
  }

  calculateDuration(startDate, endDate): any {
    const diff = endDate.getTime() - startDate.getTime();
    return diff / 60000;
  }

  upsertEvent(event: Event): Observable<Event> {
    let obs: Observable<DBResult>;
    console.log(moment(event.StartDate).toISOString());
    console.log(moment(event.EndDate).toISOString());
    console.log(event.Id);
    const req: any = {
      Subject: event?.TaskName,
      Description: event?.Notes,
      WhoId: event.ContactId,
      StartDateTime: moment(event.StartDate).toISOString(),
      EndDateTime: moment(event.EndDate).toISOString(),
      IsAllDayEvent: event.AllDay,
    };
    if (event?.OpportunityId) {
      req['WhatId'] = event.OpportunityId;
    }

    if (event.Id) {
      obs = this.api.patch<DBResult>(this.apiSettings.getUpdateUrl(this.SF_OBJ, event.Id), req);
    } else {
      obs = this.api.post<DBResult>(this.apiSettings.getInsertUrl(this.SF_OBJ), req);
    }
    return obs.pipe(
      map((res) => {
        console.log(res);
        if (res) {
          event.Id = res.id;
        }
        return event;
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
    let query = `${this.queryEvent()} WHERE OwnerId = '${this.user.userId}'`;
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
      map((res) => res.records.map(this.parseSF)),
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
