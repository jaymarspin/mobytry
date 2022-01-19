import { Observable } from 'rxjs';
import { TaskFilterModel } from '../models/common/filter.model';
import { Task } from '../models/common/task.model';
import { Moment } from 'moment';
import { Event } from '../models/common/event.model';

export interface IEventApi {
  getEvents(startD: Moment, endD: Moment, search: string, oppId: string): Observable<Event[]>;
  getEventById(taskId: string): Observable<Event>;
  upsertEvent(task: Event): Observable<Event>;
  getEventsOffset(startD: Moment, endD: Moment, taskFilter: TaskFilterModel, search: string, oppId: string): Observable<Event[]>;
}
