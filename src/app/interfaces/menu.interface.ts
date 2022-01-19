import { MenuIconModel } from '../models/common/menu-icons.model';
import { SelectOption } from '../models/common/select-option.model';

export interface IMenuAPI {
  getMainMenu(): MenuIconModel[];
  getAllMenu(): MenuIconModel[];
  getLanguages(): SelectOption[];
}
