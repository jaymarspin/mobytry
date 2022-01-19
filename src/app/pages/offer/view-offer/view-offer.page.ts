import { Component, OnInit } from '@angular/core';
import { Subscription, from, forkJoin } from 'rxjs';
import { Offer } from 'src/app/models/common/offer.model';
import { ViewOfferPageRoutingKeys } from './view-offer-routing.keys';
import { CommonOfferService } from 'src/app/services/common/offer/offer.service';
import { ActivatedRoute } from '@angular/router';
import { NavController, LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { mergeMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-view-offer',
  templateUrl: './view-offer.page.html',
  styleUrls: ['./view-offer.page.scss'],
})
export class ViewOfferPage implements OnInit {
  private subs = new Subscription();
  offer: Offer;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private offerSrvc: CommonOfferService,
    private translate: TranslateService,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.subs.add(this.parseURL());
  }

  parseURL() {
    this.offer = new Offer();
    return this.route.paramMap.subscribe((params) => {
      this.offer.Id = params.get(ViewOfferPageRoutingKeys.PARAM_ID);
      this.getData(this.offer.Id);
    });
  }

  dismiss() {
    this.navCtrl.back();
  }

  getData(offerId: string) {
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
          return forkJoin([
            this.offerSrvc.getOfferById(offerId).pipe(
              tap((e) => {
                this.offer = e;
                console.log(this.offer);
              })
            ),
          ]).pipe(
            tap(
              (e) => {
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

  isShowFooter(item: Offer) {
    return item?.Status?.toLocaleLowerCase() === 'accepted' || item?.Status?.toLocaleLowerCase() === 'declined' ? false : true;
  }

  accept() {
    this.offer.Status = 'ACCEPTED';
  }

  decline() {
    this.offer.Status = 'DECLINED';
  }

  print() {}
}
