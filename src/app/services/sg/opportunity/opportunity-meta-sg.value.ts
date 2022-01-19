import { OpportunityMeta } from 'src/app/models/common/opportunity-meta.model';

export const OpportunityMetaSG: OpportunityMeta = {
  vehicleType: [
    { value: 'New', label: 'New' },
    { value: 'Used', label: 'Used' },
  ],
  company: [
    { value: '02', label: 'PML' },
    { value: '888', label: 'PMA' },
  ], // Change to API in the future
  starredFilter: [
    {
      value: 'All',
      label: 'All',
    },
    {
      value: 'Starred',
      label: 'Starred',
    },
    {
      value: 'Unstarred',
      label: 'Unstarred',
    },
  ],
};
