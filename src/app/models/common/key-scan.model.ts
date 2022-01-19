// import { VehModel } from 'src/app/models/veh-model.class';
import * as moment from 'moment';
import { Vehicle } from 'src/app/models/common/vehicle.model';

export class KeyScan {
  // modelObj: VehModel;
  model: string;
  keyscanDT = moment();
  chassis: string;
  regNum: string;
  veh: Vehicle;

  //   static fromTD(td: Testdrive): KeyScan {
  //     const rv = new KeyScan();
  //     // rv.modelObj = td.model;
  //     rv.model = td.modelId;
  //     rv.keyscanDT = td.keyscanDT;
  //     rv.chassis = td.fullChassis;
  //     rv.regNum = td.regNum;
  //     return rv;
  //   }
}
