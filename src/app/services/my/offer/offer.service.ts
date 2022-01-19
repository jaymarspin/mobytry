import { Injectable } from '@angular/core';
import { Offer } from 'src/app/models/common/offer.model';
import { Observable, of } from 'rxjs';
import { IOfferApi } from 'src/app/interfaces/offer-api.interface';
import { OfferFilterModel } from 'src/app/models/common/filter.model';

@Injectable({
  providedIn: 'root',
})
export class OfferServiceMY implements IOfferApi {
  constructor() {}

  getOffersByKeyword(oppId: string, keyword: string): Observable<Offer[]> {
    const vehId = [0, 1, 2];
    return of(
      vehId.map((i) => {
        const offer = new Offer();
        offer.OpportunityId = i.toString();
        offer.SourceName = 'Referral Programme';
        offer.CreatedDate = '09/14/2011 11:09 AM';
        offer.Id = i.toString();
        offer.ContactId = i.toString();
        offer.ContactName = 'Dominique Kevin Macasero';
        offer.Status = 'ACCEPTED';
        offer.VariantName = 'TEST VEHICLE';
        offer.VariantId = 'Test';
        offer.YearMake = '2019';
        offer.SellingPrice = 10000;
        offer.ExciseDuty = 10000;
        offer.FleetDiscountPctg = 5;
        offer.FleetDiscount = 10000;
        offer.Discount = 10000;
        offer.SalesCampaign = 10000;
        offer.Merchandise = 10000;
        offer.RegType = 'Test';
        offer.RegFee = 10000;
        offer.HPOwnership = 'Test';
        offer.HPOwnershipPrice = 10000;
        offer.RoadTax = 10000;
        offer.Insurance = 10000;
        offer.BookingFee = 10000;
        return offer;
      })
    );
  }

  getOffers(oppId: string, filter?: OfferFilterModel): Observable<Offer[]> {
    const vehId = [0, 1, 2];
    return of(
      vehId.map((i) => {
        const offer = new Offer();
        offer.OpportunityId = i.toString();
        offer.SourceName = 'Referral Programme';
        offer.CreatedDate = '09/14/2011 11:09 AM';
        offer.Id = i.toString();
        offer.ContactId = i.toString();
        offer.ContactName = 'Dominique Kevin Macasero';
        offer.Status = 'ACCEPTED';
        offer.VariantName = 'TEST VEHICLE';
        offer.VariantId = 'Test';
        offer.YearMake = '2019';
        offer.SellingPrice = 10000;
        offer.ExciseDuty = 10000;
        offer.FleetDiscountPctg = 5;
        offer.FleetDiscount = 10000;
        offer.Discount = 10000;
        offer.SalesCampaign = 10000;
        offer.Merchandise = 10000;
        offer.RegType = 'Test';
        offer.RegFee = 10000;
        offer.HPOwnership = 'Test';
        offer.HPOwnershipPrice = 10000;
        offer.RoadTax = 10000;
        offer.Insurance = 10000;
        offer.BookingFee = 10000;
        return offer;
      })
    );
  }

  getOfferById(offerId: string): Observable<Offer> {
    const offer = new Offer();
    offer.OpportunityId = '1';
    offer.SourceName = 'Referral Programme';
    offer.CreatedDate = '09/14/2011 11:09 AM';
    offer.Id = '1';
    offer.ContactId = '1';
    offer.ContactName = 'Dominique Kevin Macasero';
    offer.Status = 'ACCEPTED';
    offer.VariantName = 'TEST VEHICLE';
    offer.VariantId = 'Test';
    offer.YearMake = '2019';
    offer.SellingPrice = 10000;
    offer.ExciseDuty = 10000;
    offer.FleetDiscountPctg = 5;
    offer.FleetDiscount = 10000;
    offer.Discount = 10000;
    offer.SalesCampaign = 10000;
    offer.Merchandise = 10000;
    offer.RegType = 'Individual';
    offer.RegFee = 10000;
    offer.HPOwnership = 'Test';
    offer.HPOwnershipPrice = 10000;
    offer.RoadTax = 10000;
    offer.Insurance = 10000;
    offer.BookingFee = 10000;
    offer.Subtotal = 100000;
    offer.Total = 100000;
    return of(offer);
  }
}
