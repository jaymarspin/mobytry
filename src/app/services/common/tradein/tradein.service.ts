import { Injectable, Inject } from '@angular/core';
import { TRADEIN_SERVICE_KEY } from 'src/app/service-providers/dynamic-key.provider';
import { ITradeinApi } from 'src/app/interfaces/tradein-api.interface';
import { ErrorService } from '../error/error.service';
import { TradeInFilterModel } from 'src/app/models/common/filter.model';
import { Observable } from 'rxjs';
import { Purchaser, TradeIn } from 'src/app/models/common/tradein.model';
import { SelectOption } from 'src/app/models/common/select-option.model';

@Injectable({
  providedIn: 'root',
})
export class CommonTradeinService {
  constructor(@Inject(TRADEIN_SERVICE_KEY) private tradeinAPI: ITradeinApi, private errorSrvc: ErrorService) {}

  getTradeIns(filter: TradeInFilterModel, tradeInId?: string, oppId?: string): Observable<TradeIn[]> {
    try {
      return this.tradeinAPI.getTradeIns(filter, tradeInId, oppId);
    } catch (e) {
      this.errorSrvc.presentServerErr(e);
    }
  }

  upsertTradeIn(tradeIn: TradeIn): Observable<TradeIn[]> {
    try {
      return this.tradeinAPI.upsertTradeIn(tradeIn);
    } catch (e) {
      this.errorSrvc.presentServerErr(e);
    }
  }

  getMakes(): Observable<SelectOption[]> {
    try {
      return this.tradeinAPI.getMakes();
    } catch (e) {
      this.errorSrvc.presentServerErr(e);
    }
  }

  getPurchasers(name?: string): Observable<Purchaser[]> {
    try {
      return this.tradeinAPI.getPurchasers(name);
    } catch (e) {
      this.errorSrvc.presentServerErr(e);
    }
  }

  getSources(): Observable<SelectOption[]> {
    try {
      return this.tradeinAPI.getSources();
    } catch (e) {
      this.errorSrvc.presentServerErr(e);
    }
  }
}
