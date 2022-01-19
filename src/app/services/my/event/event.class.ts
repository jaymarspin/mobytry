import { Moment } from 'moment';
import * as moment from 'moment';
import { Event } from 'src/app/models/common/event.model';

export class EventSF {
  static SF_OBJ = 'Event';
  public static queryEvent(): string {
    return `SELECT Id, WhoId, Location, CRM_Indication__c, StartDateTime, EndDateTime, Subject, Description, WhatId FROM ${this.SF_OBJ}`;
  }

  public static parseSF(apiRes): Event {
    delete apiRes.attributes;
    const event = new Event();
    event.Id = apiRes.Id;
    event.ContactId = null;
    event.OpportunityId = null;
    event.CreatedDate = null;
    event.ContactName = null;
    event.SourceId = null;
    event.SourceName = null;
    event.StartDate = null;
    event.StartTime = null;
    event.EndTime = null;
    event.TaskName = apiRes.Subject;
    event.Category = 'Event';
    event.Status = null;
    event.AllDay = null;
    event.Alert = null;
    event.Notes = apiRes.Description;
    event.isComplete = apiRes.IsClosed ? true : false;
    event.EndDate = moment(apiRes.ActivityDate).toDate().toString();
    return event;
  }
}
