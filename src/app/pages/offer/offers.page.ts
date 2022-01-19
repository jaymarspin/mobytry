import { Component, OnInit } from '@angular/core';
import { Offer } from 'src/app/models/common/offer.model';
import { Subscription, from } from 'rxjs';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { OffersPageRoutingKeys } from './offers-routing.keys';
import { CommonOfferService } from 'src/app/services/common/offer/offer.service';
import { EditOfferPageRoutingKeys } from './edit-offer/edit-offer-routing.keys';
import { ViewOfferPageRoutingKeys } from './view-offer/view-offer-routing.keys';
import { TranslateService } from '@ngx-translate/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { mergeMap, tap } from 'rxjs/operators';
import { OfferFilterModel } from 'src/app/models/common/filter.model';
import { FilterOfferComponent } from './components/filter-offer/filter-offer.component';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit {
  private subs = new Subscription();
  offers: Offer[];
  oppId: string;
  filterObj: OfferFilterModel;
  searchInput: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private offerSrvc: CommonOfferService,
    private translate: TranslateService,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.subs.add(this.parseURL());
  }

  parseURL() {
    return this.route.paramMap.subscribe((params) => {
      this.oppId = params.get(OffersPageRoutingKeys.PARAM_ID);
      if (this.oppId === OffersPageRoutingKeys.PARAM_ID) {
        this.oppId = '';
      }
      this.getOffers(null);
    });
  }

  getOffers(filter?: OfferFilterModel) {
    this.translate
      .get('Common_Loading')
      .pipe(
        mergeMap((lang) => {
          return from(
            this.loadingCtrl.create({
              message: lang,
            })
          );
        }),
        mergeMap((loading) => {
          loading.present();
          return this.offerSrvc.getOffers(this.oppId, filter).pipe(
            tap(
              (e) => {
                this.offers = e;
                loading.dismiss();
              },
              (err) => {
                loading.dismiss();
              }
            )
          );
        })
      )
      .subscribe();
  }

  goToOffer(item: Offer) {
    this.router.navigate([`${OffersPageRoutingKeys.BASE}/${this.oppId}/${EditOfferPageRoutingKeys.BASE}/${item.Id}`]);
  }

  getColor(offer: Offer) {
    if (offer.Status.toLocaleLowerCase() === 'accept') {
      return 'accepted';
    } else if (offer.Status.toLocaleLowerCase() === 'reject') {
      return 'rejected';
    } else {
      return 'pending';
    }
  }

  add() {
    const state = new Object();
    state[EditOfferPageRoutingKeys.STATE_OPPID] = this.oppId;
    const navigationExtras: NavigationExtras = {
      state,
    };
    this.router.navigate(
      [`${OffersPageRoutingKeys.BASE}/${this.oppId}/${EditOfferPageRoutingKeys.BASE}/${EditOfferPageRoutingKeys.PARAM_ID}`],
      navigationExtras
    );
  }

  view(offer: Offer) {
    this.router.navigate([`${OffersPageRoutingKeys.BASE}/${this.oppId}/${ViewOfferPageRoutingKeys.BASE}/${offer.Id}`]);
  }

  showFilter() {
    from(
      this.modalCtrl.create({
        component: FilterOfferComponent,
        backdropDismiss: false,
        animated: true,
        cssClass: 'full-screen',
        componentProps: {
          filterObj: this.filterObj ? Object.assign({}, this.filterObj) : null,
        },
      })
    ).subscribe((modal) => {
      from(modal.onDidDismiss()).subscribe((res: any) => {
        if (res && res.data) {
          this.filterObj = res.data;
          console.log(this.filterObj);
          this.getOffers(this.filterObj);
        }
      });
      modal.present();
    });
  }

  search() {
    this.translate
      .get('Common_Loading')
      .pipe(
        mergeMap((lang) => {
          return from(
            this.loadingCtrl.create({
              message: lang,
            })
          );
        }),
        mergeMap((loading) => {
          loading.present();
          return this.offerSrvc.getOffersByKeyword(this.oppId, this.searchInput).pipe(
            tap(
              (e) => {
                this.offers = e;
                loading.dismiss();
              },
              (err) => {
                loading.dismiss();
              }
            )
          );
        })
      )
      .subscribe();
  }
}
