import { ContactModel } from './contact.model';

export class Testdrive {
  public Id: string;
  public Name: string;
  public ContactId: string;
  public OpportunityId: string;
  public CreatedDate: string;
  public ContactName: string;
  public SourceId: string;
  public SourceName: string;
  public DocType: string;
  public DocNum: string;
  public DrivingLicense: string;
  public ExpiryDate: string;
  public PlannedStartDate: string;
  public ModelId: string;
  public Vehicle: Vehicle;
  public Contact: ContactModel;
  public IsSigned: boolean;
  public TradePlate: string;
  public Status: string;
  public SalesRep: string;

  constructor(values: object = {}) {
    Object.assign(this, values);
  }
}

export class Vehicle {
  public Id: string;
  public Name: string;
  public Status: string;
  public StockId: string;
  public MileageStart: string;
  public MileageEnd: string;
  public StartTime: string;
  public Notes: string;
  public RegNum: string;
  public Chassis: string;
  public ShortDesc: string;
  constructor(values: object = {}) {
    Object.assign(this, values);
  }
}
