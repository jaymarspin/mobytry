import { Testdrive } from 'src/app/models/common/testdrive.model';
import { Vehicle } from 'src/app/models/common/vehicle.model';

export class KeyScan {
  modelObj: Vehicle;
  model: string;
  keyscanDT: string;
  chassis: string;
  regNum: string;

  static fromTD(td: Testdrive): KeyScan {
    const rv = new KeyScan();
    rv.modelObj = td.Vehicle;
    rv.model = td.Vehicle.Id;
    rv.chassis = td.Vehicle.Chassis;
    rv.regNum = td.Vehicle.RegNum;
    return rv;
  }
}
