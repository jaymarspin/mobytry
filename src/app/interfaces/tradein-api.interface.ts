import { Observable } from 'rxjs';
import { Purchaser, TradeIn } from '../models/common/tradein.model';
import { SelectOption } from '../models/common/select-option.model';
import { TradeInFilterModel } from '../models/common/filter.model';

export interface ITradeinApi {
  getTradeIns(filter: TradeInFilterModel, tradeInId?: string, oppId?: string): Observable<TradeIn[]>;
  upsertTradeIn(tradeIn: TradeIn): Observable<TradeIn[]>;
  getMakes(): Observable<SelectOption[]>;
  getPurchasers(name?: string): Observable<Purchaser[]>;
  getSources(): Observable<SelectOption[]>;
}
