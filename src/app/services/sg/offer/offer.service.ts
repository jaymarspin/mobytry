import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Offer } from 'src/app/models/common/offer.model';
import { IOfferApi } from 'src/app/interfaces/offer-api.interface';
import { OfferFilterModel } from 'src/app/models/common/filter.model';

@Injectable({
  providedIn: 'root',
})
export class OfferServiceSG implements IOfferApi {
  constructor() {}

  getOffersByKeyword(oppId: string, keyword: string): Observable<Offer[]> {
    throw new Error('Method not implemented.');
  }

  getOffers(oppId: string, filter?: OfferFilterModel) {
    const vehId = [0, 1, 2];
    return of(
      vehId.map((i) => {
        const offer = new Offer();
        offer.VariantName = 'Test Vehicle';
        offer.CreatedDate = '09/14/2011 11:09 AM';
        offer.Id = i.toString();
        offer.ContactId = i.toString();
        offer.Status = 'ACCEPT';
        offer.SellingPrice = 100000;
        return offer;
      })
    );
  }

  getOfferById(offerId: string): Observable<Offer> {
    const offer = new Offer();
    offer.VariantName = 'Test Vehicle';
    offer.CreatedDate = '09/14/2011 11:09 AM';
    offer.Id = '1';
    offer.ContactId = '1';
    offer.Status = 'ACCEPT';
    offer.SellingPrice = 100000;
    return of(offer);
  }
}
