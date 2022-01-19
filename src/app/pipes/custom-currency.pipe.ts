import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { environment } from 'src/environments/environment';

@Pipe({
  name: 'CustomCurrency',
})
export class CustomCurrencyPipe extends CurrencyPipe implements PipeTransform {
  transform(
    value: number | string,
    currencyCode?: string,
    display?: 'code' | 'symbol' | 'symbol-narrow' | string | boolean,
    digitsInfo?: string,
    locale?: string
  ): string | null;
  transform(
    value: null | undefined,
    currencyCode?: string,
    display?: 'code' | 'symbol' | 'symbol-narrow' | string | boolean,
    digitsInfo?: string,
    locale?: string
  ): null;
  transform(
    value: number | string | null | undefined,
    currencyCode?: string,
    display?: 'code' | 'symbol' | 'symbol-narrow' | string | boolean,
    digitsInfo?: string,
    locale?: string
  ): string | null {
    return super.transform(value, currencyCode || this.getCurrency(), display || 'symbol', digitsInfo, locale || this.getLocale());
  }

  getCurrency() {
    if (environment.countryCode === 'my') {
      return 'MYR ';
    } else if (environment.countryCode === 'sg') {
      return 'SGD ';
    } else {
      return 'THB ';
    }
  }

  getLocale() {
    if (environment.countryCode === 'my') {
      return 'en_MY';
    } else if (environment.countryCode === 'sg') {
      return 'en_SG';
    } else {
      return 'th_TH';
    }
  }
}
