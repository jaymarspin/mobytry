export class OppFilterModel {
  tdStatus: string;
  oppStatus: string;
  leadStatus: string;
  oppSource: string;
  starredOpp: string;
  startDate: string;
  endDate: string;
  withOpenBookings: boolean;
  withPendingTasks: boolean;
  withAppointment: boolean;

  constructor(values: object = {}) {
    Object.assign(this, values);
  }
}

export class TdFilterModel {
  tdStatus: string;
  constructor(values: object = {}) {
    Object.assign(this, values);
  }
}

export class TradeInFilterModel {
  tdStatus: string;
  source: string;
  constructor(values: object = {}) {
    Object.assign(this, values);
  }
}

export class OfferFilterModel {
  offerStatus: string;
  constructor(values: object = {}) {
    Object.assign(this, values);
  }
}

export class TaskFilterModel {
  taskStatus: string;
  category: string;
  startDate: string;
  endDate: string;
  constructor(values: object = {}) {
    Object.assign(this, values);
  }
}

export class NotificationsFilterModel {
  startDate: string;
  endDate: string;
  constructor(values: object = {}) {
    Object.assign(this, values);
  }
}
