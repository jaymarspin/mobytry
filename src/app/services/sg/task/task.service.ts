import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Moment } from 'moment';
import { Observable, of } from 'rxjs';
import { catchError, filter, map, tap } from 'rxjs/operators';
import { ITaskApi } from 'src/app/interfaces/task-api.interface';
import { TaskFilterModel } from 'src/app/models/common/filter.model';
import { Task } from 'src/app/models/common/task.model';
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
export class TaskServiceSG implements ITaskApi {
  private user: User;
  private currTask: Task[] = [];
  private offset = 0;

  SF_OBJ = 'Task';
  constructor(private errorSrvc: ErrorService, private api: ApiService, private apiSettings: ApiSG, private auth: AuthenticationService) {
    this.offset = 0;
    this.currTask = [];
    this.auth.subUser().subscribe((u) => {
      this.user = u;
    });
  }

  getTasks(startD: Moment, endD: Moment, search: string, oppId: string): Observable<Task[]> {
    if (!this.user || !this.user.userId) {
      return of([]);
    }
    const startDate = startD;
    const endDate = endD;
    const query = `${this.queryTask()} WHERE OwnerId = '${this.user.userId}' AND ActivityDate >= ${startDate.format('YYYY-MM-DD')}
                 AND ActivityDate <= ${endDate.format('YYYY-MM-DD')} ORDER BY ActivityDate DESC`;
    console.log(query);
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

  getTaskById(taskId: string): Observable<Task> {
    if (!taskId) {
      throw new Error('Invalid Id.');
    }
    const query = `${this.queryTask()} WHERE Id = '${taskId}'`;
    return this.api.get<Query>(this.apiSettings.getQueryUrl(query)).pipe(
      map((res) => {
        if (!res || !res.records || res.records.length <= 0) {
          return [];
        }
        return res.records.map(this.parseSF);
      }),
      map((tasks: Task[]) => {
        return tasks && tasks.length > 0 ? tasks[0] : null;
      }),
      catchError((err) => {
        this.errorSrvc.presentServerErr(err);
        throw err;
      })
    );
  }

  getTasksByKeyword(oppId: string, keyword?: string): Observable<Task[]> {
    const taskid = [0, 1, 2];
    return of(
      taskid.map((i) => {
        const task = new Task();
        task.Id = i.toString();
        task.ContactId = i.toString();
        task.OpportunityId = i.toString();
        task.CreatedDate = new Date().toString();
        task.ContactName = 'Ronald Robertson';
        task.SourceName = 'Referral Programme';
        // task.StartDate = new Date().toString();
        task.DueDate = new Date().toString();
        task.TaskName = 'TEST TASK';
        task.Category = 'General Task';
        task.Status = 'Completed';
        task.AllDay = true;
        task.Alert = '1hr';
        task.Notes = '';
        task.isComplete = true;
        return task;
      })
    );
  }

  upsertTask(task: Task): Observable<Task> {
    let obs: Observable<DBResult>;
    const req = {
      Subject: task.TaskName,
      Status: task.Status,
      Description: task.Notes,
      WhoId: task.ContactId,
      ActivityDate: "jkawdjkahwd",
    };
    if (task.OpportunityId) {
      req['WhatId'] = task.OpportunityId;
    }
    console.log(req);
    if (task.Id) {
      obs = this.api.patch<DBResult>(this.apiSettings.getUpdateUrl(this.SF_OBJ, task.Id), req);
    } else {
      obs = this.api.post<DBResult>(this.apiSettings.getInsertUrl(this.SF_OBJ), req);
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
        throw new Error('Error Inserting new task');
      })
    );
  }

  getTasksOffset(startD: Moment, endD: Moment, taskFilter: TaskFilterModel, search: string, oppId: string) {
    if (!this.user || !this.user.userId) {
      return of([]);
    }
    let query = `${this.queryTask()} WHERE OwnerId = '${this.user.userId}'`;
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
          this.currTask.push(tasks);
        });
        this.offset = this.offset + arr.length;
      }),
      map((arr) => {
        return this.currTask;
      }),
      catchError((err) => {
        this.errorSrvc.presentServerErr(err);
        throw err;
      })
    );
  }

  queryTask(): string {
    return (
      'SELECT Id, WhoId, Who.Name, ActivityDate, Subject, Description, CRM_Indication__c, Status, IsClosed, WhatId, Follow_Up_Offer__c, ' +
      `Sales_Offer_Reference_PL__c, RecordTypeId, CreatedDate FROM ${this.SF_OBJ}`
    );
  }

  parseSF(apiRes): Task {
    delete apiRes.attributes;
    const task = new Task();
    task.Id = apiRes.Id;
    task.OpportunityId = null;
    task.CreatedDate = apiRes.CreatedDate;
    task.ContactId = apiRes.WhoId;
    task.ContactName = apiRes.Who?.Name;
    task.SourceId = null;
    task.SourceName = null;
    task.StartDate = null;
    task.TaskName = apiRes.Subject;
    task.Category = 'Task';
    task.Status = apiRes.IsClosed ? 'Completed' : 'Open';
    task.AllDay = null;
    task.Alert = null;
    task.Notes = apiRes.Description;
    task.isComplete = apiRes.IsClosed ? true : false;
    task.DueDate = moment(apiRes.ActivityDate).format('DD MMM YYYY');
    return task;
  }
}
