import { Component, OnInit } from '@angular/core';
import { CommonOpportunityService } from 'src/app/services/common/opportunity/opportunity.service';
import { Opportunity } from 'src/app/models/common/opportunity.model';
import { Subscription, from, forkJoin } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { OpportunityDetailsPageRoutingKeys } from './opportunity-details-routing.keys';
import { TestdrivePageRoutingKeys } from '../../testdrive/testdrives/testdrive-routing.keys';
import { TasksPageRoutingKeys } from '../../task/tasks-routing.keys';
import { AcitiviesPageRoutingKeys } from '../../logs/activities/activities-routing.keys';
import { OffersPageRoutingKeys } from '../../offer/offers-routing.keys';
import { BookingsPageRoutingKeys } from '../../booking/bookings/bookings-routing.keys';
import { DeliveriesPageRoutingKeys } from '../../delivery/deliveries/deliveries-routing.keys';
import { ModalController, LoadingController } from '@ionic/angular';
import { SelectorComponent } from 'src/app/components/common/selector/selector.component';
import { SelectOption } from 'src/app/models/common/select-option.model';
import { ErrorService } from 'src/app/services/common/error/error.service';
import { tap, map, mergeMap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { FormErrorMessages } from 'src/app/models/common/form-error.model';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { TradeinsPageRoutingKeys } from '../../tradein/tradeins/tradeins-routing.keys';
import { environment } from 'src/environments/environment';
import { OppConstant } from '../../../services/sg/opportunity/opportunity.constant';
import { ModelInterestSelectorComponent } from '../../../components/common/model-interest-selector/model-interest-selector.component';
import { Campaign } from 'src/app/models/common/campaign.model';

@Component({
  selector: 'app-opportunity-details',
  templateUrl: './opportunity-details.page.html',
  styleUrls: ['./opportunity-details.page.scss'],
})
export class OpportunityDetailsPage implements OnInit {
  private subs = new Subscription();
  opp: Opportunity;
  models: SelectOption[];
  ppDateRange: SelectOption[];
  cmpgList: Campaign[];
  chnlList: string[];
  oppForm: FormGroup;
  formErrorMessages: FormErrorMessages;
  countryCode = environment.countryCode;
  customPPDate: string = OppConstant.PP_DATE_CUSTOM;
  isPPDChanged: boolean;
  ppDateMin: string;
  ppDateMax: string;

  constructor(
    private opportunityService: CommonOpportunityService,
    private route: ActivatedRoute,
    private router: Router,
    private modalController: ModalController,
    private translate: TranslateService,
    private loadingCtrl: LoadingController,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.oppForm = this.initOppForm();
    this.subs.add(this.parseURL());
  }

  private initOppForm(): FormGroup {
    const oppForm = this.formBuilder.group({
      name: [''],
      company: [''],
      modelInterest: [[], [Validators.required]],
      warmth: [0],
      notes: [''],
      PPD: [''],
      PPDRange: [[''], [Validators.required]],
      PPDReason: [''],
      source: [],
      channel: [],
    });
    this.initErrorMessages(oppForm);
    return oppForm;
  }

  parseURL() {
    this.opp = new Opportunity();
    return this.route.paramMap.subscribe((params) => {
      this.opp.Id = params.get(OpportunityDetailsPageRoutingKeys.PARAM_ID);
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
              this.getOpportunities(this.opp.Id).pipe(
                mergeMap((opp) => {
                  return forkJoin([this.getPPRange(), this.getCmpgList()]);
                })
              ),
            ]).pipe(
              tap(
                (e) => {
                  this.isPPDChanged = undefined;
                  this.updateForm();
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
    });
  }

  compareId(o1, o2) {
    return o1 && o2 ? o1.Id === o2.Id : o1 === o2;
  }

  getPPRange() {
    return this.opportunityService.getPPDateRange(this.opp.Company).pipe(
      tap((e) => {
        this.ppDateRange = e;
        const opt = new SelectOption();
        opt.label = this.customPPDate;
        opt.value = this.customPPDate;
        this.ppDateRange.push(opt);
        const today = new Date();
        today.setMonth(0);
        today.setDate(1);
        this.ppDateMin = today.toJSON();
        const maxDate = new Date(today.getFullYear() + 1, 11, 31);
        this.ppDateMax = maxDate.toJSON();
      })
    );
  }

  getCmpgList() {
    return this.opportunityService.getCmpgList(this.opp.Company).pipe(
      tap((e) => {
        this.cmpgList = e;
        this.chnlList = this.opp.Cmpg?.Channel;
      })
    );
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
          case 'modelInterest':
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

  getOpportunities(oppId: string) {
    return this.opportunityService.getOpportunityById(oppId).pipe(
      tap((e) => {
        console.log(e);
        this.opp = e;
      })
    );
  }

  updateForm() {
    if (this.oppForm && this.opp) {
      if (this.opp.IntentStatus === 'Hot') {
        this.opp.Warmth = 100;
      } else if (this.opp.IntentStatus === 'Warm') {
        this.opp.Warmth = 50;
      } else if (this.opp.IntentStatus === 'Cold') {
        this.opp.Warmth = 0;
      }
      this.oppForm.reset(
        {
          name: this.opp.ContactName,
          company: this.opp.Company,
          channel: this.opp.Channel,
          source: this.opp.Cmpg,
          warmth: this.opp.Warmth,
          modelInterest: this.opp.ModelInterest,
          notes: this.opp.Notes,
          PPD: this.opp.PlannedPurchasedDate,
          PPDRange: this.opp.PlannedPurchaseDateRange,
          PPDReason: this.opp.PlannedPurchaseDateReason,
        },
        { emitEvent: false }
      );
    }
  }

  getOppColor(oppStatus: string, opp: Opportunity) {
    if (oppStatus === 'open') {
      if (opp.IsClosed) {
        return 'assets/icon/opportunity/unlock-disabled.svg';
      } else {
        return 'assets/icon/opportunity/unlock.svg';
      }
    } else if (oppStatus === 'closed') {
      if (opp.IsClosed) {
        return 'warning';
      } else {
        return 'medium';
      }
    } else {
      if (opp.Type === 'DEFERRED') {
        return 'warning';
      } else {
        return 'medium';
      }
    }
  }

  updateOppStatus(type: string) {
    if (this.countryCode === 'my') {
      if (type === 'open') {
        this.opp.Type = 'OPEN';
      } else if (type === 'deferred') {
        this.opp.Type = 'DEFERRED';
      } else {
        this.opp.Type = 'LOST';
      }
    }
  }

  changePPD(evt: Event) {
    // prevent event on initial loading
    if (this.isPPDChanged === undefined) {
      this.isPPDChanged = false;
      return;
    }
    try {
      this.isPPDChanged = false;
      this.oppForm.controls['PPDReason'].clearValidators();
      if (this.opp && this.opp.Id) {
        const formValues = this.oppForm.value;
        if (formValues['PPDRange'] === this.customPPDate) {
          this.isPPDChanged = this.opp.PlannedPurchasedDate !== formValues['PPD'];
        } else {
          this.isPPDChanged = this.opp.PlannedPurchaseDateRange !== formValues['PPDRange'];
        }
      }

      if (this.isPPDChanged) {
        this.oppForm.controls['PPDReason'].setValidators([Validators.required]);
      }

      this.oppForm.controls['PPDReason'].updateValueAndValidity();
    } catch (err) {
      // this.err.logError(err);
      // this.err.presentServerErr(err);
    }
  }

  changeCmpgSource(evt: Event) {
    if (this.oppForm.get('source') && this.oppForm.get('source').value instanceof Campaign) {
      this.chnlList = this.oppForm.get('source').value.Channel;
      if (this.chnlList.indexOf(this.oppForm.get('channel').value) < 0) {
        this.oppForm.get('channel').reset([]);
      }
      if (this.oppForm.get('channel').disabled) {
        this.oppForm.get('channel').enable();
      }
    } else {
      this.oppForm.get('channel').disable();
    }
  }

  showModelInterestComp() {
    console.log(this.oppForm.get('company').value);
    from(
      this.modalController.create({
        component: ModelInterestSelectorComponent,
        componentProps: {
          cmp: this.oppForm.get('company').value,
          team: '',
          selectedValues: '',
        },
      })
    ).subscribe((modal) => {
      from(modal.onDidDismiss()).subscribe((modalData) => {
        if (modalData && modalData.data) {
          const selectedModel: Array<string> = modalData.data.map((model) => model.label);
          if (JSON.stringify(this.oppForm.get('modelInterest').value) !== JSON.stringify(selectedModel)) {
            this.oppForm.get('modelInterest').setValue(selectedModel);
            this.oppForm.markAsDirty();
          }
        }
      });
      modal.present();
    });
  }

  goToTestdrives() {
    this.router.navigate([`${TestdrivePageRoutingKeys.BASE}/` + this.opp.Id]);
  }

  goToTasks() {
    this.router.navigate([`${TasksPageRoutingKeys.BASE}/` + this.opp.Id]);
  }

  goToActivityLogs() {
    this.router.navigate([`${AcitiviesPageRoutingKeys.BASE}/` + this.opp.Id]);
  }

  goToOffers() {
    this.router.navigate([`${OffersPageRoutingKeys.BASE}/` + this.opp.Id]);
  }

  goToBookings() {
    // this.router.navigate([`${BookingsPageRoutingKeys.BASE}/` + this.opp.Id]);
  }

  goToDeliveries() {
    // this.router.navigate([`${DeliveriesPageRoutingKeys.BASE}/` + this.opp.Id]);
  }

  goToTradeIns() {
    this.router.navigate([`${TradeinsPageRoutingKeys.BASE}/` + this.opp.Id]);
  }

  getFavIcon(opp: Opportunity) {
    if (opp.Flag) {
      return 'star';
    } else {
      return 'star-outline';
    }
  }

  save() {
    if (!this.oppForm.valid) {
      console.log('invalid opp form!', this.oppForm);
      if (this.oppForm.hasError('ppDateReason')) {
        throw new Error(this.oppForm.getError('ppDateReason'));
      }
      return;
    }
    this.opp.ContactName = this.oppForm.get('name').value;
    this.opp.Cmpg = this.oppForm.get('source').value;
    this.opp.Channel = this.oppForm.get('channel').value;
    this.opp.ModelInterest = this.oppForm.get('modelInterest').value;
    this.opp.Company = this.oppForm.get('company').value;
    this.opp.PlannedPurchaseDateRange = this.oppForm.get('PPDRange').value;
    this.opp.PlannedPurchasedDate = this.oppForm.get('PPD').value;
    this.opp.PlannedPurchaseDateReason = this.oppForm.get('PPDReason').value;
    this.translate
      .get('Common_Saving')
      .pipe(
        mergeMap((lang) => {
          return from(
            this.loadingCtrl.create({
              message: lang,
            })
          );
        })
      )
      .subscribe(
        (loading) => {
          loading.present();
          return this.opportunityService.upsertOpp(this.opp).subscribe(
            (res) => {
              loading.dismiss();
            },
            (err) => {
              loading.dismiss();
              // add error service call
            }
          );
        },
        (err) => {
          // add error service call
        }
      );
  }
}
