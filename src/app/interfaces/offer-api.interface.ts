import { Observable } from 'rxjs';
import { Offer } from '../models/common/offer.model';
import { OfferFilterModel } from '../models/common/filter.model';

export interface IOfferApi {
  getOffers(oppId: string, filter?: OfferFilterModel): Observable<Offer[]>;
  getOffersByKeyword(oppId: string, keyword: string): Observable<Offer[]>;
  getOfferById(offerId: string): Observable<Offer>;
}
