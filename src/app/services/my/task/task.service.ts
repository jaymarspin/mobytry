import { Injectable } from '@angular/core';
import { ITaskApi } from 'src/app/interfaces/task-api.interface';
import { TaskFilterModel } from 'src/app/models/common/filter.model';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { Task } from 'src/app/models/common/task.model';
import { ErrorService } from '../../common/error/error.service';
import { ApiMY } from '../api/api-my.service';
import { ApiService } from '../../common/api/api.service';
import { AuthenticationService } from '../../common/auth/auth.service';
import { User } from 'src/app/models/common/user.model';
import { tap, map, filter, catchError } from 'rxjs/operators';
import { Moment } from 'moment';
import { TaskSF } from './task.class';
import { Query } from 'src/app/models/sg/query.model';
import { DBResult } from 'src/app/models/sg/dbresult.model';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class TaskServiceMY implements ITaskApi {
  private user: User;
  private currTask: Task[] = [];
  private offset = 0;

  constructor(private errorSrvc: ErrorService, private api: ApiService, private apiSettings: ApiMY, private auth: AuthenticationService) {
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
    let query =
      `${TaskSF.queryTask()} WHERE OwnerId = '${this.user.userId}'
       AND ` + `ActivityDate >= ${startDate.format('YYYY-MM-DD')} AND ActivityDate <= ${endDate.format('YYYY-MM-DD')}`;
    query = query + `ORDER BY ActivityDate`;
    return this.api.get<Query>(this.apiSettings.getQueryUrl(query)).pipe(
      filter((res) => res != null && res.records != null && res.records.length >= 0),
      map((res) => res.records.map(TaskSF.parseSF)),
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
    const query = `${TaskSF.queryTask()} WHERE Id = '${taskId}'`;
    return this.api.get<Query>(this.apiSettings.getQueryUrl(query)).pipe(
      map((res) => {
        if (!res || !res.records || res.records.length <= 0) {
          return [];
        }
        return res.records.map(TaskSF.parseSF);
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
        task.StartDate = new Date().toString();
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
      Id: task.Id,
      Subject: task?.TaskName,
      Status: task?.Status,
      Description: task?.Notes,
      WhoId: task.ContactId,
      IsClosed: task.isComplete,
      ActivityDate: moment(task.DueDate).toDate(),
    };
    if (task.Id) {
      obs = this.api.patch<DBResult>(this.apiSettings.getUpdateUrl(TaskSF.SF_OBJ, task.Id), req);
    } else {
      obs = this.api.post<DBResult>(this.apiSettings.getInsertUrl(TaskSF.SF_OBJ), req);
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

  getTasksOffset(startD: Moment, endD: Moment, taskFilter: TaskFilterModel, search: string, oppId: string) {
    if (!this.user || !this.user.userId) {
      return of([]);
    }
    let query = `${TaskSF.queryTask()} WHERE OwnerId = '${this.user.userId}'`;
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
      map((res) => res.records.map(TaskSF.parseSF)),
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
}
