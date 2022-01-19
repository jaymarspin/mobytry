import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, from, forkJoin } from 'rxjs';
import { Testdrive } from 'src/app/models/common/testdrive.model';
import { ViewTestdrivePageRoutingKeys } from './view-testdrive-routing.keys';
import { EditTestdrivePageRoutingKeys } from '../edit-testdrive/edit-testdrive-routing.keys';
import { CommonTestdriveService } from 'src/app/services/common/testdrive/testdrive.service';
import { TranslateService } from '@ngx-translate/core';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { tap, map } from 'rxjs/operators';
import { AlertController, LoadingController, ModalController, NavController, ToastController } from '@ionic/angular';
import { ScanTestdriveComponent } from './scan-testdrive/scan-testdrive.component';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { FormErrorMessages } from 'src/app/models/common/form-error.model';
import { TestDriveIndemnityComponent } from 'src/app/components/common/test-drive-indemnity/test-drive-indemnity.component';
import { TestDriveTNC } from 'src/app/models/common/test-drive-tnc.model';
import { KeyScannerComponent } from 'src/app/components/common/key-scanner/key-scanner.component';
import { FileEntry } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { ErrorService } from 'src/app/services/common/error/error.service';

@Component({
  selector: 'app-view-testdrive',
  templateUrl: './view-testdrive.page.html',
  styleUrls: ['./view-testdrive.page.scss'],
})
export class ViewTestdrivePage implements OnInit {
  private subs = new Subscription();
  testdrive: Testdrive;
  tdForm: FormGroup;
  formErrorMessages: FormErrorMessages;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private testdriveSrvc: CommonTestdriveService,
    private translate: TranslateService,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private navCtrl: NavController,
    private opener: FileOpener,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private errorSrvc: ErrorService
  ) {}

  ngOnInit() {
    this.tdForm = this.initTdForm();
    this.subs.add(this.parseURL());
    console.log(this.testdrive);
  }

  private initTdForm(): FormGroup {
    const tdForm = this.formBuilder.group({
      mileageEnd: [''],
      notes: [''],
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
          case 'mileageEnd':
            break;
          default:
            break;
        }
      }
    });
  }

  parseURL() {
    this.testdrive = new Testdrive();
    return this.route.paramMap.subscribe((params) => {
      this.testdrive.Id = params.get(ViewTestdrivePageRoutingKeys.PARAM_ID);
      this.getData(this.testdrive.Id);
    });
  }

  dismiss() {
    this.navCtrl.back();
  }

  getData(testdriveId: string) {
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
          return this.testdriveSrvc
            .getTestdrivesById(testdriveId)
            .pipe(
              tap((e) => {
                this.testdrive = e;
                this.updateForm();
              })
            )
            .pipe(
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

  updateForm() {
    this.tdForm.get('mileageEnd').setValue(this.testdrive.Vehicle?.MileageEnd);
    this.tdForm.get('notes').setValue(this.testdrive.Vehicle?.Notes);
  }

  editTestdrive() {
    this.router.navigate([`${EditTestdrivePageRoutingKeys.BASE}/${this.testdrive.Id}`]);
  }

  signTD() {
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
          return this.testdriveSrvc.getTNCTerms(this.testdrive).pipe(
            mergeMap((terms: TestDriveTNC, _) => {
              console.log(terms);
              return this.modalCtrl.create({
                component: TestDriveIndemnityComponent,
                componentProps: {
                  td: this.testdrive,
                  marketingConsent: terms.marketingConsent,
                  dataConsent: terms.dataConsent,
                  pdpaTerms: terms.pdpaTerms,
                  tdTerms: terms.tdTerms,
                  needsPDPA: terms.needsPDPA,
                },
              });
            }),
            mergeMap((modal) => {
              loading.dismiss();
              modal.present();
              return modal.onDidDismiss();
            })
          );
        })
      )
      .subscribe((res) => {
        if (res.data) {
          console.log(res);
          this.testdrive = Object.assign(new Testdrive(), res.data);
        }
      });
  }

  printTD() {
    return this.testdriveSrvc
      .getSignedTDPDF(this.testdrive)
      .pipe(map((fileEntry: FileEntry) => this.opener.open(fileEntry.toURL(), 'application/pdf')))
      .subscribe();
  }

  scan() {
    from(
      this.modalCtrl.create({
        component: ScanTestdriveComponent,
        backdropDismiss: false,
        animated: true,
        cssClass: 'full-screen',
        componentProps: {
          testdrive: this.testdrive ? Object.assign({}, this.testdrive) : null,
        },
      })
    ).subscribe((modal) => {
      from(modal.onDidDismiss()).subscribe((res: any) => {
        if (res && res.data) {
          this.testdrive = res.data;
        }
      });
      modal.present();
    });
  }

  endTd() {
    const btns = [];
    from(
      this.alertCtrl.create({
        backdropDismiss: false,
        inputs: [
          {
            placeholder: 'End Mileage',
            name: 'endMileage',
            type: 'text',
          },
          {
            placeholder: 'Customer Comments',
            name: 'remarks',
            type: 'text',
          },
        ],
      })
    )
      .pipe(
        mergeMap((alert) => {
          return forkJoin([
            this.translate.get('ViewTestdrivePage_EndTD').pipe(
              tap((lang) => {
                alert.header = lang;
              })
            ),
            this.translate.get('Common_Cancel').pipe(
              tap((lang) => {
                btns.push({
                  text: lang,
                  role: 'cancel',
                  handler: () => {},
                });
              })
            ),
            this.translate.get('ViewTestdrivePage_End').pipe(
              tap((lang) => {
                btns.push({
                  text: lang,
                  handler: (data) => {
                    if (!data.endMileage) {
                      this.errorSrvc.presentServerErr('Please key in the mileage');
                      return false;
                    }
                    if (this.testdrive.Vehicle.MileageStart >= data.endMileage) {
                      this.errorSrvc.presentServerErr(`Mileage must be higher than starting mileage (${this.testdrive.Vehicle.MileageStart})`);
                      return false;
                    }
                    this.translate
                      .get('Common_Loading')
                      .pipe(
                        mergeMap((loadLang) => {
                          return from(
                            this.loadingCtrl.create({
                              message: loadLang,
                            })
                          );
                        }),
                        mergeMap((loading) => {
                          loading.present();
                          this.testdrive.Vehicle.MileageEnd = data.endMileage;
                          this.testdrive.Vehicle.Notes = data.remarks;
                          return this.testdriveSrvc
                            .endTestdrive(this.testdrive)
                            .pipe(
                              tap((res) => {
                                this.testdrive = res;
                              })
                            )
                            .pipe(
                              tap(
                                (e) => {
                                  loading.dismiss();
                                },
                                (err) => {
                                  this.testdrive.Vehicle.MileageEnd = '';
                                  this.testdrive.Vehicle.Notes = '';
                                  loading.dismiss();
                                  console.log(err);
                                  this.errorSrvc.presentServerErr(err);
                                  return false;
                                }
                              )
                            );
                        })
                      )
                      .subscribe();
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

  showFooter() {
    return this.testdrive?.Vehicle?.Status.toLocaleLowerCase() === 'completed' ? false : true;
  }

  disableNextButton() {
    if (this.testdrive && this.testdrive?.Vehicle) {
      return this.tdForm.invalid;
    } else {
      return false;
    }
  }
}
