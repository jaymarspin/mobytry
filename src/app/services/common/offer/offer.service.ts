import { Injectable, Inject } from '@angular/core';
import { IOfferApi } from 'src/app/interfaces/offer-api.interface';
import { OFFER_SERVICE_KEY } from 'src/app/service-providers/dynamic-key.provider';
import { ErrorService } from '../error/error.service';
import { Offer } from 'src/app/models/common/offer.model';
import { Observable } from 'rxjs';
import { OfferFilterModel } from 'src/app/models/common/filter.model';

@Injectable({
  providedIn: 'root',
})
export class CommonOfferService {
  constructor(@Inject(OFFER_SERVICE_KEY) private offerAPI: IOfferApi, private errorSrvc: ErrorService) {}

  getOffers(oppId?: string, filter?: OfferFilterModel): Observable<Offer[]> {
    const id = oppId ? oppId : '';
    try {
      return this.offerAPI.getOffers(id, filter);
    } catch (e) {
      this.errorSrvc.presentServerErr(e);
    }
  }

  getOffersByKeyword(oppId: string, keyword: string): Observable<Offer[]> {
    try {
      return this.offerAPI.getOffersByKeyword(oppId, keyword);
    } catch (e) {
      this.errorSrvc.presentServerErr(e);
    }
  }

  getOfferById(offerId: string): Observable<Offer> {
    try {
      if (offerId && offerId.trim()) {
        return this.offerAPI.getOfferById(offerId);
      }
    } catch (e) {
      this.errorSrvc.presentServerErr(e);
    }
  }
}
