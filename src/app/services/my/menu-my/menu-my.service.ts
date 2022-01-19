import { Injectable } from '@angular/core';
import { IMenuAPI } from 'src/app/interfaces/menu.interface';
import { SelectOption } from 'src/app/models/common/select-option.model';
import { MenuIconModel } from 'src/app/models/common/menu-icons.model';
import { TranslateService } from '@ngx-translate/core';
import { tap, flatMap, mergeMap } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MenuAPIMY implements IMenuAPI {
  constructor(private translate: TranslateService) {}

  getMainMenu(): MenuIconModel[] {
    const arr: MenuIconModel[] = [];
    forkJoin([
      this.translate.get('Menu_NewLeads').pipe(
        tap((e) => {
          arr.push({
            title: e,
            value: 'New Contact',
            type: 'sales',
            url: 'assets/icon/menu/newleads.svg',
            showIndicator: false,
            desc: '',
          });
        })
      ),
      this.translate.get('Menu_OpenOpportunity').pipe(
        tap((e) => {
          arr.push({
            title: e,
            value: 'New Opportunity',
            type: 'sales',
            url: 'assets/icon/menu/new-opp.svg',
            showIndicator: false,
            desc: '',
          });
        })
      ),
      this.translate.get('Menu_TestDrive').pipe(
        tap((e) => {
          arr.push({
            title: e,
            value: 'Test Drive',
            type: 'aftersales',
            url: 'assets/icon/menu/testdrive.svg',
            showIndicator: false,
            desc: '',
          });
        })
      ),
      this.translate.get('Menu_Task').pipe(
        tap((e) => {
          arr.push({
            title: e,
            value: 'Task',
            type: 'documents',
            url: 'assets/icon/menu/calendar.svg',
            showIndicator: false,
            desc: '',
          });
        })
      ),
      this.translate.get('Menu_NewCar').pipe(
        tap((e) => {
          arr.push({
            title: e,
            value: 'New Car Quotation',
            type: 'sales',
            url: 'assets/icon/menu/quotation.svg',
            showIndicator: false,
            desc: '',
          });
        })
      ),
      this.translate.get('Menu_UsedCar').pipe(
        tap((e) => {
          arr.push({
            title: e,
            value: 'Used Car Quotation',
            type: 'sales',
            url: 'assets/icon/menu/used-car.svg',
            showIndicator: false,
            desc: '',
          });
        })
      ),
      this.translate.get('Menu_TradeIn').pipe(
        tap((e) => {
          arr.push({
            title: e,
            value: 'Trade-In',
            type: 'sales',
            url: 'assets/icon/menu/tradein.svg',
            showIndicator: false,
            desc: '',
          });
        })
      ),
      this.translate.get('Menu_More').pipe(
        tap((e) => {
          arr.push({
            title: e,
            value: 'More',
            type: 'sales',
            url: 'assets/icon/menu/more.svg',
            showIndicator: false,
            desc: '',
          });
        })
      ),
    ]).subscribe();
    return arr;
  }

  getAllMenu(): MenuIconModel[] {
    const arr: MenuIconModel[] = [];
    forkJoin([
      this.translate.get('Menu_NewLeads').pipe(
        mergeMap((title) => {
          return this.translate.get('Menu_Desc_NewLeads').pipe(
            tap((desc) => {
              arr.push({
                title,
                value: 'New Contact',
                type: 'sales',
                url: 'assets/icon/menu/newleads.svg',
                showIndicator: false,
                desc,
              });
            })
          );
        })
      ),
      this.translate.get('Menu_Task').pipe(
        mergeMap((title) => {
          return this.translate.get('Menu_Desc_Task').pipe(
            tap((desc) => {
              arr.push({
                title,
                value: 'Task',
                type: 'documents',
                url: 'assets/icon/menu/calendar.svg',
                showIndicator: false,
                desc,
              });
            })
          );
        })
      ),
      this.translate.get('Menu_TestDrive').pipe(
        mergeMap((title) => {
          return this.translate.get('Menu_Desc_TestDrive').pipe(
            tap((desc) => {
              arr.push({
                title,
                value: 'Test Drive',
                type: 'aftersales',
                url: 'assets/icon/menu/testdrive.svg',
                showIndicator: false,
                desc,
              });
            })
          );
        })
      ),
      this.translate.get('Menu_OpenOpportunity').pipe(
        mergeMap((title) => {
          return this.translate.get('Menu_Desc_OpenOpportunity').pipe(
            tap((desc) => {
              arr.push({
                title,
                value: 'Open Opportunity',
                type: 'sales',
                url: 'assets/icon/menu/open-opp.svg',
                showIndicator: false,
                desc,
              });
            })
          );
        })
      ),
      this.translate.get('Menu_TradeIn').pipe(
        mergeMap((title) => {
          return this.translate.get('Menu_Desc_TradeIn').pipe(
            tap((desc) => {
              arr.push({
                title,
                value: 'Trade-In',
                type: 'sales',
                url: 'assets/icon/menu/tradein.svg',
                showIndicator: false,
                desc,
              });
            })
          );
        })
      ),
      this.translate.get('Menu_Quotation').pipe(
        mergeMap((title) => {
          return this.translate.get('Menu_Desc_Quotation').pipe(
            tap((desc) => {
              arr.push({
                title,
                value: 'Quotation',
                type: 'sales',
                url: 'assets/icon/menu/quotation.svg',
                showIndicator: false,
                desc,
              });
            })
          );
        })
      ),
      this.translate.get('Menu_CheckStock').pipe(
        mergeMap((title) => {
          return this.translate.get('Menu_Desc_CheckStock').pipe(
            tap((desc) => {
              arr.push({
                title,
                value: 'Check Stock',
                type: 'sales',
                url: 'assets/icon/menu/check-stocks.svg',
                showIndicator: false,
                desc,
              });
            })
          );
        })
      ),
    ]).subscribe();
    return arr;
  }

  getLanguages(): SelectOption[] {
    const arr: SelectOption[] = [];
    forkJoin([
      this.translate.get('LanguagePage_English').pipe(
        tap((e) => {
          arr.push({
            label: e,
            value: 'English',
          });
        })
      ),
      this.translate.get('LanguagePage_Chinese').pipe(
        tap((e) => {
          arr.push({
            label: e,
            value: 'Chinese',
          });
        })
      ),
      this.translate.get('LanguagePage_BahasaMalaysia').pipe(
        tap((e) => {
          arr.push({
            label: e,
            value: 'Bahasa Malaysia',
          });
        })
      ),
    ]).subscribe();
    return arr;
  }
}
