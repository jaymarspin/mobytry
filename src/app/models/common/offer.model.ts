export class Offer {
  public Id: string;
  public OpportunityId: string;
  public SourceName: string;
  public ContactName: string;
  public ContactId: string;
  public CreatedDate: string;
  public Status: string;
  public VariantName: string;
  public VariantId: string;
  public YearMake: string;
  public SellingPrice: number;
  public ExciseDuty: number;
  public FleetDiscountPctg: number;
  public FleetDiscount: number;
  public Discount: number;
  public SalesCampaign: number;
  public Merchandise: number;
  public RegType: string;
  public RegFee: number;
  public HPOwnership: string;
  public HPOwnershipPrice: number;
  public RoadTax: number;
  public Insurance: number;
  public BookingFee: number;
  public Subtotal?: number;
  public Total?: number;

  constructor(values: object = {}) {
    Object.assign(this, values);
  }
}
