import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin, from, Subscription } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import { TradeInFilterModel } from 'src/app/models/common/filter.model';
import { TradeIn } from 'src/app/models/common/tradein.model';
import { CommonTradeinService } from 'src/app/services/common/tradein/tradein.service';
import { NewLeadsRoutingKeys } from '../../new-leads/new-leads-routing.keys';
import { TradeinUpdateProfilePageRoutingKeys } from '../edit-tradein/update-profile/update-profile-routing.keys';
import { TradeinViewProfilePageRoutingKeys } from '../view-tradein/view-tradein-routing.keys';
import { FilterTradeinComponent } from './components/filter-tradein/filter-tradein.component';
import { TradeinsPageRoutingKeys } from './tradeins-routing.keys';

@Component({
  selector: 'app-tradeins',
  templateUrl: './tradeins.page.html',
  styleUrls: ['./tradeins.page.scss'],
})
export class TradeinsPage implements OnInit {
  private subs = new Subscription();
  tradeins: TradeIn[];
  oppId: string;
  filterObj: TradeInFilterModel;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tradeinSrvc: CommonTradeinService,
    private modalCtrl: ModalController,
    private translate: TranslateService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.subs.add(this.parseURL());
  }

  parseURL() {
    return this.route.paramMap.subscribe((params) => {
      this.oppId = params.get(TradeinsPageRoutingKeys.PARAM_ID);
      if (this.oppId === TradeinsPageRoutingKeys.PARAM_ID) {
        this.oppId = '';
      }
      this.getData(undefined, undefined, this.oppId);
    });
  }

  getData(filter: TradeInFilterModel, tradeIn: string, oppId: string) {
    return this.translate
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
          console.log(oppId);
          return this.tradeinSrvc.getTradeIns(filter, tradeIn, oppId).pipe(
            tap(
              (e) => {
                this.tradeins = e;
                console.log(this.tradeins);
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

  goToTestdrive(item: TradeIn) {
    // this.router.navigate([`${ViewTestdrivePageRoutingKeys.BASE}/${item.Id}`]);
  }

  add() {
    const btns = [];
    from(
      this.alertCtrl.create({
        backdropDismiss: false,
      })
    )
      .pipe(
        mergeMap((alert) => {
          return forkJoin([
            this.translate.get('TradeInsPage_IsOwner').pipe(
              tap((lang) => {
                alert.header = lang;
              })
            ),
            this.translate.get('TradeInsPage_OneOption').pipe(
              tap((lang) => {
                alert.message = lang;
              })
            ),
            this.translate.get('Common_No').pipe(
              tap((lang) => {
                btns.push({
                  text: lang,
                  handler: () => {
                    this.updateOwner(false);
                  },
                });
              })
            ),
            this.translate.get('Common_Yes').pipe(
              tap((lang) => {
                btns.push({
                  text: lang,
                  handler: () => {
                    this.updateOwner(true);
                  },
                });
              })
            ),
          ]).pipe(
            tap(() => {
              alert.buttons = btns;
              alert.present();
            })
          );
        })
      )
      .subscribe();
  }

  updateOwner(owner: boolean) {
    if (owner) {
      this.router.navigate([`${TradeinUpdateProfilePageRoutingKeys.BASE}/${this.oppId}/${owner}`]);
    } else {
      this.router.navigate([`${NewLeadsRoutingKeys.BASE}/${this.oppId}`]);
    }
  }

  goToTradeIn(item: TradeIn) {
    this.router.navigate([`${TradeinViewProfilePageRoutingKeys.BASE}/${item.Id}`]);
  }

  showFilter() {
    from(
      this.modalCtrl.create({
        component: FilterTradeinComponent,
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
          this.getData(this.filterObj, undefined, this.oppId);
        }
      });
      modal.present();
    });
  }
}
