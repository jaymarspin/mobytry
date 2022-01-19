export class Campaign {
  public Id: string;
  public Name: string;
  public Channel: string[];

  constructor(values: object = {}) {
    Object.assign(this, values);
  }
}
