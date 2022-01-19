import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, ModalController, NavController, AlertController, IonBackButtonDelegate } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin, from, Subscription } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import { SelectorComponent } from 'src/app/components/common/selector/selector.component';
import { ContactModel } from 'src/app/models/common/contact.model';
import { FormErrorMessages } from 'src/app/models/common/form-error.model';
import { Opportunity } from 'src/app/models/common/opportunity.model';
import { SelectOption } from 'src/app/models/common/select-option.model';
import { CommonContactService } from 'src/app/services/common/contact/contact.service';
import { ErrorService } from 'src/app/services/common/error/error.service';
import { CommonOpportunityService } from 'src/app/services/common/opportunity/opportunity.service';
import { OpportunityDetailsPageRoutingKeys } from '../opportunity-details/opportunity-details-routing.keys';
import { EditOpportunityPageRoutingKeys } from './edit-opportunity.keys';
import { environment } from 'src/environments/environment';
import { ModelInterestSelectorComponent } from 'src/app/components/common/model-interest-selector/model-interest-selector.component';
import { OppConstant } from 'src/app/services/sg/opportunity/opportunity.constant';
import { Campaign } from 'src/app/models/common/campaign.model';
import { User } from 'src/app/models/common/user.model';
import { AuthenticationService } from 'src/app/services/common/auth/auth.service';
import { ViewContactPageRoutingKeys } from '../../contact/view-contact/view-contact-routing.keys';

@Component({
  selector: 'app-edit-opportunity',
  templateUrl: './edit-opportunity.page.html',
  styleUrls: ['./edit-opportunity.page.scss'],
})
export class EditOpportunityPage implements OnInit {
  @ViewChild(IonBackButtonDelegate, { static: false }) backButton: IonBackButtonDelegate;

  pageTitle: string;
  private subs = new Subscription();
  oppForm: FormGroup;
  formErrorMessages: FormErrorMessages;
  states: object;
  contact: ContactModel;
  opportunity: Opportunity;
  models: SelectOption[];
  sources: SelectOption[];
  companyList = this.opportunitySrvc.getCompanyList();
  vehicleType = this.opportunitySrvc.getVehicleType();
  countryCode = environment.countryCode;
  ppDateRange: SelectOption[];
  customPPDate: string = OppConstant.PP_DATE_CUSTOM;
  isPPDChanged: boolean;
  ppDateMin: string;
  ppDateMax: string;
  cmpgList: Campaign[];
  chnlList: string[];
  user: User;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private router: Router,
    private opportunitySrvc: CommonOpportunityService,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private contactService: CommonContactService,
    private errorSrvc: ErrorService,
    private modalController: ModalController,
    private auth: AuthenticationService,
    private alertCtrl: AlertController
  ) {
    this.auth.subUser().subscribe((u) => {
      this.user = u;
    });
  }

  ngOnInit() {
    this.oppForm = this.initOppForm();
    this.subs.add(this.parseURL());
  }

  parseURL() {
    this.contact = new ContactModel();
    return this.route.paramMap.subscribe((params) => {
      const oppId = params.get(EditOpportunityPageRoutingKeys.PARAM_ID);
      if (oppId === EditOpportunityPageRoutingKeys.PARAM_ID) {
        this.translate.get('EditOpportunityPage_NewOpportunity').subscribe((e) => {
          this.pageTitle = e;
        });
      } else {
        this.translate.get('EditOpportunityPage_EditOpportunity').subscribe((e) => {
          this.pageTitle = e;
        });
      }
      if (this.router.getCurrentNavigation().extras.state) {
        this.states = this.router.getCurrentNavigation().extras.state;
        this.opportunity = this.states[EditOpportunityPageRoutingKeys.STATE_OPP];
        this.opportunity.Id = oppId === EditOpportunityPageRoutingKeys.PARAM_ID ? null : oppId;
        this.getDetails(this.opportunity.ContactId);
      }
    });
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter');
    this.setUIBackButtonAction();
  }

  setUIBackButtonAction() {
    if (this.states[EditOpportunityPageRoutingKeys.PAGE_HISTORY] && this.states[EditOpportunityPageRoutingKeys.PAGE_HISTORY] === 'new_contact') {
      this.backButton.onClick = () => {
        this.router.navigate([ViewContactPageRoutingKeys.BASE + '/' + this.opportunity.ContactId]);
      };
    }
  }

  private initOppForm(): FormGroup {
    const oppForm = this.formBuilder.group({
      id: [''],
      name: [{ value: '', disabled: true }],
      company: ['', [Validators.required]],
      source: ['', [Validators.required]],
      channel: [[], [Validators.required]],
      vehType: ['', [Validators.required]],
      modelInterest: [[], [Validators.required]],
      PPDRange: [''],
      PPD: [''],
      warmth: [0],
      notes: [''],
    });
    this.initErrorMessages(oppForm);
    return oppForm;
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
          case 'company':
          case 'source':
          case 'vehType':
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

  showModelInterestComp() {
    if (!this.oppForm.get('company').value) {
      // show error message to select company
      return;
    }
    from(
      this.modalController.create({
        component: ModelInterestSelectorComponent,
        componentProps: {
          cmp: this.oppForm.get('company').value,
          team: '',
          selectedValues: this.oppForm.get('modelInterest').value,
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

  getDetails(id: string) {
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
            this.contactService.getContactById(id).pipe(
              tap((e) => {
                this.contact = e;
                this.oppForm.get('name').setValue(this.opportunity.ContactName);
              })
            ),
          ]).pipe(
            tap(
              (e) => {
                loading.dismiss();
              },
              (err) => {
                loading.dismiss();
                this.errorSrvc.presentServerErr(err);
              }
            )
          );
        })
      )
      .subscribe();
  }

  loadCompanyDependentApi() {
    if (!this.oppForm.get('company').value) {
      return false;
    }
    const cmp = this.oppForm.get('company').value;
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
          return forkJoin([this.checkForExistingOpp(cmp), this.getPPRange(cmp), this.getCmpgList(cmp)]).pipe(
            tap(
              (e) => {
                loading.dismiss();
              },
              (err) => {
                loading.dismiss();
                this.errorSrvc.presentServerErr(err);
              }
            )
          );
        })
      )
      .subscribe();
  }

  getPPRange(cmp: string) {
    return this.opportunitySrvc.getPPDateRange(cmp).pipe(
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

  getCmpgList(cmp: string) {
    return this.opportunitySrvc.getCmpgList(cmp).pipe(
      tap((e) => {
        this.cmpgList = e;
      })
    );
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

  compareId(o1, o2) {
    return o1 && o2 ? o1.Id === o2.Id : o1 === o2;
  }

  checkForExistingOpp(cmp: string) {
    const personId = this.opportunity.ContactId;
    const sc = this.user.userId;
    return this.opportunitySrvc.checkExistingOpportunity(personId, cmp, sc).pipe(
      tap((e) => {
        if (e?.length > 0) {
          this.genAlert(e);
        }
      })
    );
  }

  async genAlert(opp: Opportunity[]) {
    const alert = await this.alertCtrl.create({
      header: 'Duplicate Opportunity',
      message:
        `<p>You have an open opportunity with the same customer,</p>` +
        `<p><Strong>'Use Existing'</Strong> to go to the existing opportunity,</p>` +
        `<p><Strong>'Create New'</Strong> to generate another new opportunity.</p>`,
      backdropDismiss: false,
      buttons: [
        {
          text: 'Create New',
          role: 'cancel',
          handler: () => {
            console.log('Create New clicked');
          },
        },
        {
          text: 'Use Existing',
          handler: () => {
            this.navCtrl.back();
            setTimeout((_) => {
              this.navCtrl.navigateForward(OpportunityDetailsPageRoutingKeys.BASE + '/' + opp[0].Id);
            }, 1000);
          },
        },
      ],
    });
    alert.present();
  }

  done() {
    this.opportunity.ContactName = this.oppForm.get('name').value;
    this.opportunity.Cmpg = this.oppForm.get('source').value;
    this.opportunity.Channel = this.oppForm.get('channel').value;
    this.opportunity.ModelInterest = this.oppForm.get('modelInterest').value;
    this.opportunity.Company = this.oppForm.get('company').value;
    this.opportunity.PlannedPurchaseDateRange = this.oppForm.get('PPDRange').value;
    this.opportunity.PlannedPurchasedDate = this.oppForm.get('PPD').value;
    this.opportunity.Type = 'Vehicle Sales';
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
          return this.opportunitySrvc.upsertOpp(this.opportunity).pipe(
            tap(
              (e) => {
                this.opportunity = e;
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
          this.navCtrl.navigateForward(OpportunityDetailsPageRoutingKeys.BASE + '/' + this.opportunity.Id);
        }, 1000);
      });
  }
}
