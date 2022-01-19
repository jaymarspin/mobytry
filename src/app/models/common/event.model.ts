import { Task } from './task.model';

export class Event extends Task {
  public StartTime: string;
  public EndTime: string;

  public Id: string;
  public ContactId: string;
  public OpportunityId: string;
  public CreatedDate: string;
  public ContactName: string;
  public SourceId: string;
  public SourceName: string;
  public StartDate: string;
  public EndDate: string;
  public EventName: string;
  public Category: string;
  public Status: string;
  public AllDay: boolean;
  public Alert: string;
  public Notes: string;
  public isComplete: boolean;
}
