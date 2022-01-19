import { Component, OnInit, Input } from '@angular/core';
import { Testdrive } from 'src/app/models/common/testdrive.model';
import { ModalController, AlertController, PopoverController, LoadingController } from '@ionic/angular';
import { from, forkJoin } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { tap, mergeMap, map } from 'rxjs/operators';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { FormErrorMessages } from 'src/app/models/common/form-error.model';
import { KeyScannerComponent } from 'src/app/components/common/key-scanner/key-scanner.component';
import { CommonTestdriveService } from 'src/app/services/common/testdrive/testdrive.service';

@Component({
  selector: 'app-scan-testdrive',
  templateUrl: './scan-testdrive.component.html',
  styleUrls: ['./scan-testdrive.component.scss'],
})
export class ScanTestdriveComponent implements OnInit {
  @Input() testdrive: Testdrive;
  tdForm: FormGroup;
  formErrorMessages: FormErrorMessages;

  constructor(
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private popover: PopoverController,
    private tdService: CommonTestdriveService,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.tdForm = this.initTdForm();
  }

  private initTdForm(): FormGroup {
    const tdForm = this.formBuilder.group({
      regNo: ['', [Validators.required]],
      variantName: ['', [Validators.required]],
      mileageStart: ['', [Validators.required]],
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
          case 'regNo':
          case 'variantName':
          case 'mileageStart':
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

  apply() {
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
          this.testdrive.Vehicle.MileageStart = this.tdForm.get('mileageStart').value;
          return this.tdService
            .startTestdrive(this.testdrive)
            .pipe(
              tap((e) => {
                this.testdrive = e;
              })
            )
            .pipe(
              tap(
                (e) => {
                  loading.dismiss();
                  this.modalCtrl.dismiss(this.testdrive);
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

  cancel() {
    this.modalCtrl.dismiss();
  }

  qrScanner() {
    from(
      this.popover.create({
        component: KeyScannerComponent,
        showBackdrop: true,
        cssClass: 'full-popover',
        backdropDismiss: false,
        animated: false,
      })
    )
      .pipe(
        tap((popover) => popover.present()),
        mergeMap((popover) => popover.onDidDismiss()),
        map((popoverData) => {
          if (!popoverData || !popoverData.data) {
            return;
          }
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
                return this.tdService.getVehByRegNo(popoverData.data.regNum).pipe(
                  tap((res) => {
                    this.testdrive.Vehicle = res;
                    this.tdForm.get('regNo').setValue(res.RegNum);
                    this.tdForm.get('variantName').setValue(res.ShortDesc);
                    this.tdForm.get('mileageStart').setValue(res.MileageStart);
                    this.loadingCtrl.dismiss();
                  })
                );
              })
            )
            .subscribe();
        })
      )
      .subscribe();
  }

  search() {
    const btns = [];
    from(
      this.alertCtrl.create({
        backdropDismiss: false,
        inputs: [
          {
            name: 'regNo',
            type: 'text',
          },
        ],
      })
    )
      .pipe(
        mergeMap((alert) => {
          return forkJoin([
            this.translate.get('ViewTestdrivePage_EnterRegistrationNumber').pipe(
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
            this.translate.get('Common_Search').pipe(
              tap((lang) => {
                btns.push({
                  text: lang,
                  handler: (data) => {
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
                          return this.tdService.getVehByRegNo(data.regNo).pipe(
                            tap((res) => {
                              this.testdrive.Vehicle = res;
                              this.tdForm.get('regNo').setValue(res.RegNum);
                              this.tdForm.get('variantName').setValue(res.ShortDesc);
                              this.tdForm.get('mileageStart').setValue(res.MileageStart);
                              this.loadingCtrl.dismiss();
                            })
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
}
