import { Moment } from 'moment';
import * as moment from 'moment';
import { Task } from 'src/app/models/common/task.model';

export class TaskSF {
  static SF_OBJ = 'Task';
  public static queryTask(): string {
    return (
      'SELECT Id, WhoId, ActivityDate, Subject, Description, CRM_Indication__c, Status, IsClosed, WhatId, Follow_Up_Offer__c, ' +
      `Sales_Offer_Reference_PL__c, RecordTypeId, CreatedDate FROM ${this.SF_OBJ}`
    );
  }

  public static parseSF(apiRes): Task {
    delete apiRes.attributes;
    const task = new Task();
    task.Id = apiRes.Id;
    task.ContactId = null;
    task.OpportunityId = null;
    task.CreatedDate = apiRes.CreatedDate;
    task.ContactName = null;
    task.SourceId = null;
    task.SourceName = null;
    task.StartDate = null;
    task.TaskName = apiRes.Subject;
    task.Category = 'Task';
    task.Status = apiRes.IsClosed ? 'Completed' : 'Open';
    task.AllDay = null;
    task.Alert = null;
    task.Notes = apiRes.Description;
    task.isComplete = apiRes.IsClosed ? true : false;
    task.DueDate = moment(apiRes.ActivityDate).toDate().toString();
    return task;
  }
}
