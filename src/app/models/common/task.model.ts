export class Task {
  public Id: string;
  public ContactId: string;
  public OpportunityId: string;
  public CreatedDate: string;
  public ContactName: string;
  public SourceId: string;
  public SourceName: string;
  public StartDate: string;
  public DueDate: string;
  public TaskName: string;
  public Category: string;
  public Status: string;
  public AllDay: boolean;
  public Alert: string;
  public Notes: string;
  public isComplete: boolean;
  public RecordTypeId: string;

  constructor(values: object = {}) {
    Object.assign(this, values);
  }
}
