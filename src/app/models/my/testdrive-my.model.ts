export class TestdriveMY {
  public DrivingLicenseF: string;
  public DrivingLicenseB: string;
  public DocF: string;
  public DocB: string;
  public Pdpa: string;
  public Thankyou: string;

  constructor(values: object = {}) {
    Object.assign(this, values);
  }
}
