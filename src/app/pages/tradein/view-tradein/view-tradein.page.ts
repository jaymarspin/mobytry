import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, ModalController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin, from, Subscription } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import { TradeIn } from 'src/app/models/common/tradein.model';
import { CommonTradeinService } from 'src/app/services/common/tradein/tradein.service';
import { environment } from 'src/environments/environment';
import { TradeinViewProfilePageRoutingKeys } from './view-tradein-routing.keys';

@Component({
  selector: 'app-view-tradein',
  templateUrl: './view-tradein.page.html',
  styleUrls: ['./view-tradein.page.scss'],
})
export class ViewTradeinPage implements OnInit {
  countryCode = environment.countryCode;
  private subs = new Subscription();
  tradein: TradeIn;

  constructor(
    private route: ActivatedRoute,
    private tradeInSrvc: CommonTradeinService,
    private translate: TranslateService,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.subs.add(this.parseURL());
  }

  parseURL() {
    this.tradein = new TradeIn();
    return this.route.paramMap.subscribe((params) => {
      this.tradein.Id = params.get(TradeinViewProfilePageRoutingKeys.PARAM_ID);
      this.getData(this.tradein.Id);
    });
  }

  dismiss() {
    this.navCtrl.back();
  }

  getData(tradeInId: string) {
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
            this.tradeInSrvc.getTradeIns(null, tradeInId).pipe(
              tap((e) => {
                this.tradein = e[0];
                console.log(e);
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

  noteTrimmer(note) {
    return note.trim();
  }
}
