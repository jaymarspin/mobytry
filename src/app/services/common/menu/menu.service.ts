import { Injectable, Inject } from '@angular/core';
import { MenuIconModel } from 'src/app/models/common/menu-icons.model';
import { SelectOption } from 'src/app/models/common/select-option.model';
import { MENU_API_KEY } from 'src/app/service-providers/dynamic-key.provider';
import { IMenuAPI } from 'src/app/interfaces/menu.interface';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  constructor(@Inject(MENU_API_KEY) private menuAPI: IMenuAPI) {}

  getMainMenu(): MenuIconModel[] {
    return this.menuAPI.getMainMenu();
  }

  getAllMenu(): MenuIconModel[] {
    return this.menuAPI.getAllMenu();
  }

  getLanguages(): SelectOption[] {
    return this.menuAPI.getLanguages();
  }
}
