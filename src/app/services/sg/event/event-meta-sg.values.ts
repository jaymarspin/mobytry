import { OpportunityMeta } from 'src/app/models/common/opportunity-meta.model';
import { EventMeta } from 'src/app/models/common/event-meta.model';

export const EventMetaSG: EventMeta = {
  category: [
    { value: 'General Task', label: 'General Task' },
    { value: 'Scheduled Appointment', label: 'Scheduled Appointment' },
  ],
  status: [
    { value: 'Open', label: 'Open' },
    { value: 'Completed', label: 'Completed' },
  ],
  alert: [
    {
      value: '1 Hour before',
      label: '1 Hour before',
    },
    {
      value: '2 Hours before',
      label: '2 Hours before',
    },
    {
      value: '12 Hours before',
      label: '12 Hours before',
    },
    {
      value: '24 Hours before',
      label: '24 Hours before',
    },
  ],
};
