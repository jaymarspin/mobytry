import { Observable } from 'rxjs';
import { TaskFilterModel } from '../models/common/filter.model';
import { Task } from '../models/common/task.model';
import { Moment } from 'moment';
import { Event } from '../models/common/event.model';

export interface ITaskApi {
  getTasks(startD: Moment, endD: Moment, search: string, oppId: string): Observable<Task[]>;
  getTaskById(taskId: string): Observable<Task>;
  upsertTask(task: Task): Observable<Task>;
  getTasksOffset(startD: Moment, endD: Moment, taskFilter: TaskFilterModel, search: string, oppId: string): Observable<Task[]>;
}
