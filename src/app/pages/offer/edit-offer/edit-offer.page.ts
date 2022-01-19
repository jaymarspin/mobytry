import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { from, Subscription } from 'rxjs';
import { SelectorComponent } from 'src/app/components/common/selector/selector.component';
import { FormErrorMessages } from 'src/app/models/common/form-error.model';
import { Offer } from 'src/app/models/common/offer.model';
import { SelectOption } from 'src/app/models/common/select-option.model';
import { CommonOfferService } from 'src/app/services/common/offer/offer.service';
import { environment } from 'src/environments/environment';
import { EditOfferPageRoutingKeys } from './edit-offer-routing.keys';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit {
  pageTitle: string;
  private subs = new Subscription();
  offer: Offer;
  states: object;
  countryCode = environment.countryCode;
  offerForm: FormGroup;
  formErrorMessages: FormErrorMessages;
  exciseDuties: SelectOption[];
  regTypes: SelectOption[];
  hpOwnerships: SelectOption[];

  constructor(
    private route: ActivatedRoute,
    private translate: TranslateService,
    private offerSrvc: CommonOfferService,
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private router: Router
  ) {}

  ngOnInit() {
    this.offerForm = this.initOfferForm();
    this.subs.add(this.parseURL());
  }

  parseURL() {
    this.offer = new Offer();
    return this.route.paramMap.subscribe((params) => {
      this.offer.Id = params.get(EditOfferPageRoutingKeys.PARAM_ID);
      if (this.offer.Id === EditOfferPageRoutingKeys.PARAM_ID) {
        this.translate.get('EditOfferPage_NewOffer').subscribe((e) => {
          this.pageTitle = e;
        });
      } else {
        this.translate.get('EditOfferPage_EditOffer').subscribe((e) => {
          this.pageTitle = e;
          this.getOfferInfo(this.offer.Id);
        });
      }
      if (this.router.getCurrentNavigation().extras.state) {
        this.states = this.router.getCurrentNavigation().extras.state;
        this.offer.OpportunityId = this.states[EditOfferPageRoutingKeys.STATE_OPPID];
        console.log(this.offer.OpportunityId);
      }
    });
  }

  private initOfferForm(): FormGroup {
    const offerForm = this.formBuilder.group({
      id: [''],
      subtotal: [{ value: '', disabled: true }],
      total: [{ value: '', disabled: true }],
      variantName: ['', [Validators.required]],
      yearMake: ['', [Validators.required]],
      sellingPrice: ['', [Validators.required]],
      exciseDuty: [''],
      fleetDiscountPctg: [''],
      fleetDiscount: [''],
      discount: [''],
      salesCampaign: [''],
      lifestyle: [''],
      regType: ['', [Validators.required]],
      regFee: [''],
      hpOwnership: [''],
      hpOwnershipFee: [''],
      roadTax: [''],
      insurance: [''],
      bookingFee: [''],
    });
    this.initErrorMessages(offerForm);
    return offerForm;
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
          case 'variantName':
          case 'yearMake':
          case 'sellingPrice':
          case 'regType':
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

  selectVariantName() {
    this.translate.get('EditOfferPage_SelectVariant').subscribe((lang) => {
      from(
        this.modalController.create({
          component: SelectorComponent,
          componentProps: {
            selectors: [],
            selected: [],
            allowMultiple: false,
            header: lang,
          },
          backdropDismiss: false,
          showBackdrop: true,
        })
      ).subscribe((modal: HTMLIonModalElement) => {
        from(modal.onDidDismiss()).subscribe((modalVal) => {
          if (modalVal && modalVal.data && modalVal.data.selection) {
            // this.setModelInterest(modalVal.data.selection);
          }
        });
        modal.present();
      });
    });
  }

  getOfferInfo(offerId: string) {
    this.offerSrvc.getOfferById(offerId).subscribe((e) => {
      this.offer = e;
      console.log(e);
    });
  }

  done() {}
}
