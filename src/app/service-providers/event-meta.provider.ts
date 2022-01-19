import { environment } from 'src/environments/environment';
import { EventMeta } from 'src/app/models/common/event-meta.model';
import { EventMetaSG } from '../services/sg/event/event-meta-sg.values';
import { EventMetaMY } from '../services/my/event/event-meta-my.values';

export const EVENT_META_KEY = 'EventMeta';
export function getEventMeta(): EventMeta {
  switch (environment.countryCode) {
    case 'sg':
      return EventMetaSG;
    case 'my':
      return EventMetaMY;
  }
}
