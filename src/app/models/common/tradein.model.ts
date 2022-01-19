export class TradeIn {
  public Id: string;
  public ContactId: string;
  public OpportunityId: string;
  public OpportunityStage: string;
  public CreatedDate: string;
  public ContactName: string;
  public SourceName: string;
  public DocNum: string;
  public Mobile: string;
  public Email: string;
  public Address: string;
  public RegNo: string;
  public Chassis: string;
  public RegDate: string;
  public YearMake: string;
  public Make: string;
  public Model: string;
  public Variant: string;
  public Mileage: string;
  public Color: string;
  public TradeInSource: string;
  public Purchaser: string;
  public Warranty: string;
  public Notes: string;
  public ExpectedPrice: number;
  public Overtrade: number;
  public Company: string;
  public Quotations: Quotation[];

  constructor(values: object = {}) {
    Object.assign(this, values);
  }
}

export class Quotation {
  public Id: string;
  public Status: string;
  public Price: number;
  public CreatedDate: string;
  public Notes: string;
  constructor(values: object = {}) {
    Object.assign(this, values);
  }
}

export class Purchaser {
  public Id: string;
  public Name: string;
  public Company: string;
  constructor(values: object = {}) {
    Object.assign(this, values);
  }
}
