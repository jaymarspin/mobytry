import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormErrorMessages } from 'src/app/models/common/form-error.model';
import { Subscription, from, forkJoin } from 'rxjs';
import { Purchaser, TradeIn } from 'src/app/models/common/tradein.model';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { mergeMap, tap } from 'rxjs/operators';
import { TradeinViewProfilePageRoutingKeys } from '../../view-tradein/view-tradein-routing.keys';
import { NavController, LoadingController, ModalController } from '@ionic/angular';
import { CommonTradeinService } from 'src/app/services/common/tradein/tradein.service';
import { TradeinProfilePageRoutingKeys } from './tradein-profile-routing.keys';
import { ActivatedRoute } from '@angular/router';
import { Opportunity } from 'src/app/models/common/opportunity.model';
import { CommonOpportunityService } from 'src/app/services/common/opportunity/opportunity.service';
import { AutocompleteComponent } from 'src/app/components/common/autocomplete/autocomplete.component';
import { AutoCompleteModel } from 'src/app/models/common/auto-complete.model';

@Component({
  selector: 'app-tradein-profile',
  templateUrl: './tradein-profile.page.html',
  styleUrls: ['./tradein-profile.page.scss'],
})
export class TradeinProfilePage implements OnInit {
  private subs = new Subscription();
  tradeinForm: FormGroup;
  formErrorMessages: FormErrorMessages;
  tradein: TradeIn;
  countryCode = environment.countryCode;
  opp: Opportunity;

  constructor(
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private tradeinSrvc: CommonTradeinService,
    private route: ActivatedRoute,
    private oppSrvc: CommonOpportunityService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.tradeinForm = this.initTradeInForm();
    this.subs.add(this.parseURL());
  }

  parseURL() {
    this.tradein = new TradeIn();
    this.opp = new Opportunity();
    return this.route.paramMap.subscribe((params) => {
      console.log(params);
      this.tradein.OpportunityId = params.get(TradeinProfilePageRoutingKeys.PARAM_ID);
      this.tradein.ContactId = params.get(TradeinProfilePageRoutingKeys.CONTACT_ID);
      this.getData();
    });
  }

  getData() {
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
            this.oppSrvc.getOpportunityById(this.tradein.OpportunityId).pipe(
              tap(
                (e) => {
                  this.opp = e;
                  // this.tradein.ContactId = this.opp.ContactId;
                  loading.dismiss();
                },
                (err) => {
                  loading.dismiss();
                }
              )
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

  selectPurchaser() {
    from(
      this.modalCtrl.create({
        component: AutocompleteComponent,
        componentProps: {
          callbackFn: (searchStr: string) => {
            return this.tradeinSrvc.getPurchasers(searchStr);
          },
          transformFn: (purchaser: Purchaser) => {
            return new AutoCompleteModel({
              Title: purchaser.Name,
            });
          },
          noResultFn: (searchStr: string) => {},
          backdropDismiss: false,
        },
      })
    ).subscribe((modal) => {
      from(modal.onDidDismiss()).subscribe((modalData) => {
        console.log(modalData);
        if (modalData && modalData.data) {
          this.tradein.Purchaser = modalData.data.Id;
          this.tradein.Company = modalData.data.Company;
          this.tradeinForm.get('purchaser').setValue(modalData.data.Name);
        }
      });
      modal.present();
    });
  }

  private initTradeInForm() {
    const tradeinForm = this.formBuilder.group({
      id: [''],
      regNo: ['', [Validators.required]],
      purchaser: ['', [Validators.required]],
      mileage: ['', [Validators.required]],
      remarks: [''],
    });
    this.initErrorMessages(tradeinForm);
    return tradeinForm;
  }

  private initErrorMessages(form: FormGroup) {
    this.translate.get('Error_CannotBeEmpty').subscribe((lang) => {
      this.formErrorMessages = {
        group: {},
      };
      if (!form) {
        return;
      }
      for (const key of Object.keys(form.controls)) {
        switch (key) {
          case 'regNo':
          case 'purchaser':
          case 'mileage':
            this.formErrorMessages[key] = {
              required: lang,
            };
            break;
          default:
            break;
        }
      }
    });
  }

  setTradein(td: TradeIn) {
    this.tradein = td;
  }

  done() {
    this.tradein.RegNo = this.tradeinForm.get('regNo').value;
    this.tradein.Mileage = this.tradeinForm.get('mileage').value;
    this.tradein.Notes = this.tradeinForm.get('remarks').value;
    this.translate
      .get('Common_Saving')
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
          return this.tradeinSrvc.upsertTradeIn(this.tradein).pipe(
            tap(
              (e) => {
                this.tradein = e[0];
                loading.dismiss();
              },
              (err) => {
                loading.dismiss();
              }
            )
          );
        })
      )
      .subscribe((e) => {
        this.navCtrl.back();
        setTimeout((_) => {
          this.navCtrl.navigateForward(TradeinViewProfilePageRoutingKeys.BASE + '/' + this.tradein.Id);
        }, 1000);
      });
  }
}
