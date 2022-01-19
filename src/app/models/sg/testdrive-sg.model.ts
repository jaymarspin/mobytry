import { Testdrive } from '../common/testdrive.model';

export class TestdriveSG extends Testdrive {
  Line1: string;
  Line2: string;
  PostalCode: string;
  Country: string;

  constructor(values: object = {}) {
    super(values);
    Object.assign(this, values);
  }
}
