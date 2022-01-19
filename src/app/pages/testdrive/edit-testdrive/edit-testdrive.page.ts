import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, ModalController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { from, Subscription } from 'rxjs';
import { catchError, distinctUntilKeyChanged, filter, map, mergeMap, tap } from 'rxjs/operators';
import { ModelInterestSelectorComponent } from 'src/app/components/common/model-interest-selector/model-interest-selector.component';
import { ContactModel } from 'src/app/models/common/contact.model';
import { FormErrorMessages } from 'src/app/models/common/form-error.model';
import { CheckboxModel } from 'src/app/models/common/model-interest-selector.model';
import { Opportunity } from 'src/app/models/common/opportunity.model';
import { Testdrive } from 'src/app/models/common/testdrive.model';
import { AuthenticationService } from 'src/app/services/common/auth/auth.service';
import { CommonContactService } from 'src/app/services/common/contact/contact.service';
import { CommonOpportunityService } from 'src/app/services/common/opportunity/opportunity.service';
import { CommonTestdriveService } from 'src/app/services/common/testdrive/testdrive.service';
import { environment } from 'src/environments/environment';
import { ViewTestdrivePageRoutingKeys } from '../view-testdrive/view-testdrive-routing.keys';
import { EditTestdrivePageRoutingKeys } from './edit-testdrive-routing.keys';

@Component({
  selector: 'app-edit-testdrive',
  templateUrl: './edit-testdrive.page.html',
  styleUrls: ['./edit-testdrive.page.scss'],
})
export class EditTestdrivePage implements OnInit {
  private subs = new Subscription();
  countryCode = environment.countryCode;
  pageTitle: string;
  testdrive: Testdrive;
  tdForm: FormGroup;
  formErrorMessages: FormErrorMessages;
  opp: Opportunity;
  maxdate = new Date(new Date().setFullYear(new Date().getFullYear() + 5)).getFullYear();
  contact: ContactModel;
  states: object;
  modelSelected: CheckboxModel;
  docList = this.contactService.getContactDocType();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private testdriveSrvc: CommonTestdriveService,
    private formBuilder: FormBuilder,
    private oppService: CommonOpportunityService,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private contactService: CommonContactService,
    private auth: AuthenticationService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.tdForm = this.initTdForm();
    this.subs.add(this.parseURL());
  }

  parseURL() {
    this.testdrive = new Testdrive();
    return this.route.paramMap.subscribe((params) => {
      this.testdrive.Id = params.get(EditTestdrivePageRoutingKeys.PARAM_ID);
      if (this.testdrive.Id === EditTestdrivePageRoutingKeys.PARAM_ID) {
        console.log(this.testdrive);
        this.translate.get('EditTestdrivePage_New').subscribe((e) => {
          this.pageTitle = e;
        });
      } else {
        this.translate.get('EditTestdrivePage_Edit').subscribe((e) => {
          this.pageTitle = e;
          this.getTestdriveInfo(this.testdrive.Id);
        });
      }
      if (this.router.getCurrentNavigation().extras.state) {
        this.states = this.router.getCurrentNavigation().extras.state;
        this.testdrive.OpportunityId = this.states[EditTestdrivePageRoutingKeys.STATE_OPPID];
      }
      this.getData();
    });
  }

  private initTdForm(): FormGroup {
    const tdForm = this.formBuilder.group({
      id: [''],
      name: ['', Validators.required],
      docType: ['', Validators.required],
      docNum: ['', Validators.required],
      birthday: ['', Validators.required],
      gender: ['', Validators.required],
      drivingLicense: ['', Validators.required],
      modelInterest: ['', Validators.required],
      expDate: [''],
      plannedStartDate: ['', Validators.required],
    });
    this.initErrorMessages(tdForm);
    return tdForm;
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
          case 'drivingLicense':
          case 'expDate':
          case 'plannedStartDate':
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
          return this.oppService.getOpportunityById(this.testdrive.OpportunityId).pipe(
            tap(
              (e) => {
                this.opp = e;
                loading.dismiss();
              },
              (err) => {
                loading.dismiss();
              }
            ),
            mergeMap((opp) => {
              console.log(opp);
              return this.contactService.getContactById(opp.ContactId).pipe(
                tap(
                  (e) => {
                    this.testdrive.Contact = e;
                    // this.testdrive.DocType = this.contact.DocType;
                    // this.testdrive.ContactName = this.contact.Name;
                    // this.testdrive.ContactId = this.contact.Id;
                    // this.testdrive.DocNum = this.contact.DocNum;
                    this.updateForm();
                    loading.dismiss();
                  },
                  (err) => {
                    loading.dismiss();
                  }
                )
              );
            }),
            map((_) => {
              return loading;
            }),
            catchError((err) => {
              loading.dismiss();
              throw err;
            })
          );
        }),
        mergeMap((loading) => {
          return this.auth.subUser().pipe(
            filter((user) => user != null && user.isLoggedIn && !!user.company),
            distinctUntilKeyChanged('userId'),
            mergeMap((u) => {
              return this.testdriveSrvc.getTdModels(new Set(u.company.map((c) => c.Name))).pipe(
                tap(
                  (e) => {
                    console.log(e);
                    loading.dismiss();
                  },
                  (err) => {
                    loading.dismiss();
                  }
                )
              );
            }),
            map((_) => {
              return loading;
            }),
            catchError((err) => {
              loading.dismiss();
              throw err;
            })
          );
        })
      )
      .subscribe((loading) => {
        loading.dismiss();
      });
  }

  updateForm() {
    this.tdForm.get('name').setValue(this.testdrive.Contact.Name);
    this.tdForm.get('docType').setValue(this.testdrive.Contact.DocType);
    this.tdForm.get('docNum').setValue(this.testdrive.Contact.DocNum);
    this.tdForm.get('birthday').setValue(this.testdrive.Contact.Birthday);
    this.tdForm.get('gender').setValue(this.testdrive.Contact.Gender);
  }

  getTestdriveInfo(testdriveId: string) {
    this.testdriveSrvc.getTestdrivesById(testdriveId).subscribe((e) => {
      this.testdrive = e;
      console.log(e);
    });
  }

  setTestdrive(td: Testdrive) {
    this.testdrive = td;
    console.log(this.testdrive);
  }

  showModelInterestComp() {
    console.log('test');
    if (!this.opp.Company) {
      // show error message to select company
      return;
    }
    from(
      this.modalController.create({
        component: ModelInterestSelectorComponent,
        componentProps: {
          cmp: this.opp.Company,
          team: '',
          selectedValues: this.tdForm.get('modelInterest').value,
          singleSelect: true,
        },
      })
    ).subscribe((modal) => {
      from(modal.onDidDismiss()).subscribe((modalData) => {
        if (modalData && modalData.data) {
          const selectedModel: Array<CheckboxModel> = modalData.data.map((model) => model);
          if (JSON.stringify(this.tdForm.get('modelInterest').value) !== JSON.stringify(selectedModel)) {
            this.modelSelected = selectedModel[0];
            this.tdForm.get('modelInterest').setValue(this.modelSelected.label);
            this.tdForm.markAsDirty();
          }
        }
      });
      modal.present();
    });
  }

  // this.tdForm.get('name').setValue(this.contact.Name);
  // this.tdForm.get('docType').setValue(this.contact.DocType);
  // this.tdForm.get('docNum').setValue(this.contact.DocNum);
  // this.tdForm.get('birthday').setValue(this.contact.Birthday);
  // this.tdForm.get('gender').setValue(this.contact.Gender);

  done() {
    this.testdrive.Contact.Name = this.tdForm.get('name').value;
    this.testdrive.Contact.DocType = this.tdForm.get('docType').value;
    this.testdrive.Contact.DocNum = this.tdForm.get('docNum').value;
    this.testdrive.Contact.Birthday = this.tdForm.get('birthday').value;
    this.testdrive.Contact.Gender = this.tdForm.get('gender').value;
    this.testdrive.ModelId = this.modelSelected.value;
    this.testdrive.PlannedStartDate = this.tdForm.get('plannedStartDate').value;
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
          return this.testdriveSrvc.insertTestdrive(this.testdrive).pipe(
            tap(
              (e) => {
                console.log(e);
                this.testdrive = e;
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
        this.tdForm.reset();
        this.navCtrl.back();
        setTimeout((_) => {
          this.navCtrl.navigateForward(ViewTestdrivePageRoutingKeys.BASE + '/' + this.testdrive.Id);
        }, 1000);
      });
  }
}
