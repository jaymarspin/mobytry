import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin, from, Subscription } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import { IContactValidator } from 'src/app/interfaces/contact-validator.interface';
import { ContactModel } from 'src/app/models/common/contact.model';
import { FormErrorMessages } from 'src/app/models/common/form-error.model';
import { Opportunity } from 'src/app/models/common/opportunity.model';
import { CONTACT_VALIDATOR_KEY } from 'src/app/service-providers/dynamic-key.provider';
import { CommonContactService } from 'src/app/services/common/contact/contact.service';
import { EditOpportunityPageRoutingKeys } from '../../opportunity/edit-opportunity/edit-opportunity.keys';
import { ViewContactPageRoutingKeys } from '../view-contact/view-contact-routing.keys';
import { EditContactPageRoutingKeys } from './edit-contact-routing.keys';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit-contact',
  templateUrl: './edit-contact.page.html',
  styleUrls: ['./edit-contact.page.scss'],
})
export class EditContactPage implements OnInit {
  pageTitle: string;
  private subs = new Subscription();
  contactForm: FormGroup;
  formErrorMessages: FormErrorMessages;
  salutationList = this.contactService.getContactSalutation();
  countryCode = this.contactService.getCountryCodeList();
  countryList = this.contactService.getCountryList();
  genderList = this.contactService.getGender();
  cityList = this.contactService.getCities();
  stateList = this.contactService.getStates();
  docList = this.contactService.getContactDocType();
  raceList = this.contactService.getRace();
  sysCountryCode = environment.countryCode;
  states: object;
  contact: ContactModel;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private router: Router,
    private contactService: CommonContactService,
    private alertCtrl: AlertController,
    @Inject(CONTACT_VALIDATOR_KEY) private validator: IContactValidator,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.contactForm = this.initContactForm();
    this.subs.add(this.parseURL());
    this.setMobileValidator();
  }

  parseURL() {
    this.contact = new ContactModel();
    return this.route.paramMap.subscribe((params) => {
      const contactId = params.get(EditContactPageRoutingKeys.PARAM_ID);
      if (contactId === EditContactPageRoutingKeys.PARAM_ID) {
        this.translate.get('EditContact_AddContact').subscribe((e) => {
          this.pageTitle = e;
          this.contactForm.get('countryCode').setValue(this.contactService.getDefaultCountryCode());
        });
      } else {
        this.translate.get('EditContact_EditContact').subscribe((e) => {
          this.pageTitle = e;
          this.getContactInfo(contactId);
        });
      }
      if (this.router.getCurrentNavigation().extras.state) {
        this.states = this.router.getCurrentNavigation().extras.state;
        console.log(this.states);
        this.contact = this.states[EditContactPageRoutingKeys.STATE_CONTACT];
        this.contact.Id = contactId === EditContactPageRoutingKeys.PARAM_ID ? null : contactId;
        const requiredValidators = this.states[EditContactPageRoutingKeys.STATE_VALIDATORS];
        if (requiredValidators) {
          requiredValidators.forEach((el) => {
            const formCtrl = this.contactForm.get(el);
            const existingValidators = formCtrl.validator ? [formCtrl.validator] : [];
            formCtrl.setValidators([...existingValidators, Validators.required]);
            const existingErr = this.formErrorMessages[el] ? this.formErrorMessages[el] : {};
            this.formErrorMessages[el] = {
              ...existingErr,
              required: 'Cannot be empty.',
            };
          });
        }
        this.contactForm.get('mobile').setValue(this.contact.MobileNo);
        this.contactForm.get('fullName').setValue(this.contact.Name);
      }
    });
  }

  private initContactForm(): FormGroup {
    const contactForm = this.formBuilder.group({
      id: [''],
      title: ['', [Validators.required]],
      fullName: ['', [Validators.required]],
      prefName: [''],
      company: [''],
      docType: [''],
      docNum: [''],
      race: [''],
      gender: ['', [Validators.required]],
      countryCode: [''],
      mobile: [''],
      email: ['', [Validators.email]],
      birthday: [''],
      line1: [''],
      line2: [''],
      postcode: [''],
      city: [''],
      state: [''],
      country: [''],
      remarks: [''],
    });
    this.initErrorMessages(contactForm);
    return contactForm;
  }

  setMobileValidator() {
    const formCtrl = this.contactForm.get('mobile');
    formCtrl.setValidators([this.validateMobile(), Validators.required]);
    formCtrl.updateValueAndValidity();
    this.formErrorMessages[`mobile`] = {
      mobileError: 'Invalid Mobile Number.',
    };
  }

  validateMobile(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control.value || control.value.length <= 0) {
        return null;
      }
      const err = { mobileError: { value: control.value } };
      if (this.contactForm.get('countryCode').value === '65') {
        if (control.value.length !== 8) {
          return err;
        }
        if (!control.value.startsWith('9') && !control.value.startsWith('8')) {
          return err;
        }
      } else {
        if (control.value.length < 9) {
          return err;
        }
      }
      return null;
    };
  }

  docTypeChanged() {
    this.contactForm = this.validator.setIDValidator(this.contactForm, this.formErrorMessages);
  }

  private initErrorMessages(form: FormGroup) {
    this.formErrorMessages = {
      group: {},
    };
    if (!form) {
      return;
    }
    for (const key of Object.keys(form.controls)) {
      switch (key) {
        case 'email':
          this.formErrorMessages[key] = {
            email: 'Invalid email.',
          };
          break;
        default:
          break;
      }
    }
  }

  done() {
    if (!this.contactForm.valid) {
      Object.values(this.contactForm.controls).forEach((ctrl) => {
        ctrl.markAsTouched({ onlySelf: true });
      });
      return;
    }
    this.contact.Title = this.contactForm.get('title').value;
    this.contact.Name = this.contactForm.get('fullName').value;
    this.contact.PrefName = this.contactForm.get('prefName').value;
    this.contact.CompanyName = this.contactForm.get('company').value;
    this.contact.DocType = this.contactForm.get('docType').value;
    this.contact.DocNum = this.contactForm.get('docNum').value;
    this.contact.Race = this.contactForm.get('race').value;
    this.contact.Gender = this.contactForm.get('gender').value;
    this.contact.MobileNo = this.contactForm.get('mobile').value;
    this.contact.CountryCode = this.contactForm.get('countryCode').value;
    this.contact.Email = this.contactForm.get('email').value;
    this.contact.Birthday = this.contactForm.get('birthday').value;
    this.contact.Line1 = this.contactForm.get('line1').value;
    this.contact.Line2 = this.contactForm.get('line2').value;
    this.contact.Postcode = this.contactForm.get('postcode').value;
    this.contact.City = this.contactForm.get('city').value;
    this.contact.State = this.contactForm.get('state').value;
    this.contact.Country = this.contactForm.get('country').value;
    this.contact.Remarks = this.contactForm.get('remarks').value;
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
          return this.contactService.upsertContact(this.contact).subscribe(
            (res) => {
              loading.dismiss();
              if (res) {
                this.createOppnConvertLead(res);
              }
            },
            (err) => {
              loading.dismiss();
              // add error service call
            }
          );
        },
        (err) => {
          console.log(err);
          // add error service call
        }
      );
  }

  createOppnConvertLead(res: ContactModel) {
    const btns = [];
    from(
      this.alertCtrl.create({
        backdropDismiss: false,
      })
    )
      .pipe(
        mergeMap((alert) => {
          return forkJoin([
            this.translate.get('EditContact_CreateNewOpportunity').pipe(
              tap((lang) => {
                alert.header = lang;
              })
            ),
            this.translate.get('Common_No').pipe(
              tap((lang) => {
                btns.push({
                  text: lang,
                  handler: () => {
                    this.contact.Id = res.Id;
                    this.navCtrl.back();
                    setTimeout((_) => {
                      this.navCtrl.navigateForward(ViewContactPageRoutingKeys.BASE + '/' + this.contact.Id);
                    }, 1000);
                  },
                });
              })
            ),
            this.translate.get('Common_Yes').pipe(
              tap((lang) => {
                btns.push({
                  text: lang,
                  handler: () => {
                    this.contact.Id = res.Id;
                    this.contact.Name = res.Name;
                    this.addOpp();
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

  getContactInfo(id: string) {
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
          return this.contactService.getContactById(id).pipe(
            tap(
              (e) => {
                loading.dismiss();
                this.contact = e;
                this.setValues();
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

  setValues() {
    this.contactForm.get('title').setValue(this.contact.Title);
    this.contactForm.get('fullName').setValue(this.contact.Name);
    this.contactForm.get('prefName').setValue(this.contact.PrefName);
    this.contactForm.get('company').setValue(this.contact.CompanyName);
    this.contactForm.get('docType').setValue(this.contact.DocType);
    this.contactForm.get('docNum').setValue(this.contact.DocNum);
    this.contactForm.get('race').setValue(this.contact.Race);
    this.contactForm.get('gender').setValue(this.contact.Gender);
    this.contactForm.get('mobile').setValue(this.contact.MobileNo);
    this.contactForm.get('countryCode').setValue(this.contact.CountryCode);
    this.contactForm.get('email').setValue(this.contact.Email);
    this.contactForm.get('birthday').setValue(this.contact.Birthday);
    this.contactForm.get('line1').setValue(this.contact.Line1);
    this.contactForm.get('line2').setValue(this.contact.Line2);
    this.contactForm.get('postcode').setValue(this.contact.Postcode);
    this.contactForm.get('city').setValue(this.contact.City);
    this.contactForm.get('state').setValue(this.contact.State);
    this.contactForm.get('country').setValue(this.contact.Country);
    this.contactForm.get('remarks').setValue(this.contact.Remarks);
  }

  addOpp() {
    const state = new Object();
    const opp = new Opportunity();
    opp.ContactId = this.contact.Id;
    opp.ContactName = this.contact.Name;
    state[EditOpportunityPageRoutingKeys.STATE_OPP] = opp;
    state[EditOpportunityPageRoutingKeys.PAGE_HISTORY] = 'new_contact';
    const navigationExtras: NavigationExtras = {
      state,
    };
    console.log(state);
    this.router.navigate([`${EditOpportunityPageRoutingKeys.BASE}/${EditOpportunityPageRoutingKeys.PARAM_ID}`], navigationExtras);
  }
}
