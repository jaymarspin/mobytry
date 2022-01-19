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
