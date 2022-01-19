import { environment } from 'src/environments/environment';
import { TaskMeta } from '../models/common/task-meta.model';
import { TaskMetaSG } from '../services/sg/task/task-meta-sg.value';
import { TaskMetaMY } from '../services/my/task/task-meta-my.value';

export const TASK_META_KEY = 'TaskMeta';
// This function returns the country specific instance based on the country code given
export function getTaskMeta(): TaskMeta {
  switch (environment.countryCode) {
    case 'sg':
      return TaskMetaSG;
    case 'my':
      return TaskMetaMY;
  }
}
