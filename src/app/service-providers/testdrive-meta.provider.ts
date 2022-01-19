import { environment } from 'src/environments/environment';
import { TestdriveMetaMY } from '../services/my/testdrive/testdrive-meta-my.value';
import { TestdriveMetaSG } from '../services/sg/testdrive/testdrive-meta-sg.value';
import { TestdriveMeta } from '../models/common/testdrive-meta.model';

export const TESTDRIVE_META_KEY = 'TestdriveMeta';
// This function returns the country specific instance based on the country code given
export function getTestdriveMeta(): TestdriveMeta {
  switch (environment.countryCode) {
    case 'sg':
      return TestdriveMetaSG;
    case 'my':
      return TestdriveMetaMY;
  }
}
