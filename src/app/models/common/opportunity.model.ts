import { Campaign } from './campaign.model';
import { SelectOption } from './select-option.model';

export class Opportunity {
  public Id: string;
  public Type: string;
  public Source: string;
  public Cmpg: Campaign;
  public Channel: string[];
  public Flag: boolean;
  public Warmth: number;
  public CreatedDate: string;
  public ContactId: string;
  public ContactName: string;
  public Company: string;
  public ModelInterest: Array<string>;
  public Notes: string;
  public PlannedPurchasedDate: string;
  public PlannedPurchaseDateRange: string;
  public PlannedPurchaseDateReason: string;
  public Stage: string;
  public IsClosed: boolean;
  public IntentStatus: string;

  constructor(values: object = {}) {
    Object.assign(this, values);
  }
}
