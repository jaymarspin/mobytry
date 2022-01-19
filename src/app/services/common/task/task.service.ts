import { Injectable, Inject } from '@angular/core';
import { TASK_SERVICE_KEY } from 'src/app/service-providers/dynamic-key.provider';
import { ErrorService } from '../error/error.service';
import { ITaskApi } from 'src/app/interfaces/task-api.interface';
import { Task } from 'src/app/models/common/task.model';
import { Observable } from 'rxjs';
import { TaskFilterModel } from 'src/app/models/common/filter.model';
import { SelectOption } from 'src/app/models/common/select-option.model';
import { TASK_META_KEY } from 'src/app/service-providers/task-meta.provider';
import { TaskMeta } from 'src/app/models/common/task-meta.model';
import { Moment } from 'moment';

@Injectable({
  providedIn: 'root',
})
export class CommonTaskService {
  constructor(@Inject(TASK_SERVICE_KEY) private taskAPI: ITaskApi, private errorSrvc: ErrorService, @Inject(TASK_META_KEY) private taskMetaParam: TaskMeta) {}

  getTasksOffset(startD: Moment, endD: Moment, taskFilter: TaskFilterModel, search: string, oppId: string): Observable<Task[]> {
    const id = oppId ? oppId : '';
    try {
      return this.taskAPI.getTasksOffset(startD, endD, taskFilter, search, id);
    } catch (e) {
      this.errorSrvc.presentServerErr(e);
    }
  }

  getTasks(startD: Moment, endD: Moment, search: string, oppId: string): Observable<Task[]> {
    const id = oppId ? oppId : '';
    try {
      return this.taskAPI.getTasks(startD, endD, search, id);
    } catch (e) {
      this.errorSrvc.presentServerErr(e);
    }
  }

  getTaskById(taskId: string): Observable<Task> {
    try {
      if (taskId && taskId.trim()) {
        return this.taskAPI.getTaskById(taskId);
      }
    } catch (e) {
      this.errorSrvc.presentServerErr(e);
    }
  }

  upsertTask(task: Task): Observable<Task> {
    try {
      return this.taskAPI.upsertTask(task);
    } catch (e) {
      this.errorSrvc.presentServerErr(e);
    }
  }

  getStatus(): SelectOption[] {
    return this.taskMetaParam.status;
  }

  getAlertTypes(): SelectOption[] {
    return this.taskMetaParam.alert;
  }
}
