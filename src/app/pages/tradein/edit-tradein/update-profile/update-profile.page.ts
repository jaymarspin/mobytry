import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { from, of, Subscription } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import { ContactModel } from 'src/app/models/common/contact.model';
import { FormErrorMessages } from 'src/app/models/common/form-error.model';
import { Opportunity } from 'src/app/models/common/opportunity.model';
import { CommonContactService } from 'src/app/services/common/contact/contact.service';
import { CommonOpportunityService } from 'src/app/services/common/opportunity/opportunity.service';
import { environment } from 'src/environments/environment';
import { TradeinProfilePageRoutingKeys } from '../tradein-profile/tradein-profile-routing.keys';
import { TradeinUpdateProfilePageRoutingKeys } from './update-profile-routing.keys';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.page.html',
  styleUrls: ['./update-profile.page.scss'],
})
export class UpdateProfilePage implements OnInit {
  sysCountryCode = environment.countryCode;
  private subs = new Subscription();
  contactForm: FormGroup;
  formErrorMessages: FormErrorMessages;
  salutationList = this.contactService.getContactSalutation();
  countryCode = this.contactService.getCountryCodeList();
  countryList = this.contactService.getCountryList();
  genderList = this.contactService.getGender();
  raceList = this.contactService.getRace();
  cityList = this.contactService.getCities();
  stateList = this.contactService.getStates();
  docList = this.contactService.getContactDocType();
  contact: ContactModel;
  opp: Opportunity;

  constructor(
    private contactService: CommonContactService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private oppSrvc: CommonOpportunityService
  ) {
    console.log(this.docList);
  }

  ngOnInit() {
    this.contactForm = this.initContactForm();
    this.subs.add(this.parseURL());
  }

  parseURL() {
    this.contact = new ContactModel();
    return this.route.paramMap.subscribe((params) => {
      console.log(params);
      const oppId = params.get(TradeinUpdateProfilePageRoutingKeys.PARAM_ID);
      const owner = params.get(TradeinUpdateProfilePageRoutingKeys.OWNER);
      this.getData(oppId, owner);
    });
  }

  getData(id: string, owner: string) {
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
          return this.oppSrvc.getOpportunityById(id).pipe(
            mergeMap((opp) => {
              this.opp = opp;
              if (owner === 'true') {
                return this.contactService.getContactById(opp.ContactId).pipe(
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
              } else if (owner === 'false') {
                loading.dismiss();
                return of(ContactModel);
              } else {
                return this.contactService.getContactById(owner).pipe(
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
              }
            })
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

  private initContactForm(): FormGroup {
    const contactForm = this.formBuilder.group({
      id: [''],
      title: [''],
      fullName: [''],
      prefName: [''],
      company: [''],
      docType: [''],
      docNum: [''],
      race: [''],
      gender: [''],
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

  next() {
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
        }),
        mergeMap((loading) => {
          loading.present();
          return this.contactService.upsertContact(this.contact).pipe(
            tap(
              (e) => {
                this.contact = e;
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
          this.navCtrl.navigateForward(TradeinProfilePageRoutingKeys.BASE + '/' + this.opp.Id + '/' + this.contact.Id);
        }, 1000);
      });
  }
}
