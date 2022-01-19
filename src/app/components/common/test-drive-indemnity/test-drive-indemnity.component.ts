import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, PopoverController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Testdrive } from 'src/app/models/common/testdrive.model';
import { ErrorService } from 'src/app/services/common/error/error.service';
import { PDFSignService } from 'src/app/services/common/pdf-sign/pdfsign.service';
import { CommonTestdriveService } from 'src/app/services/common/testdrive/testdrive.service';
import { SignatureComponent } from '../signature/signature.component';

@Component({
  selector: 'app-test-drive-indemnity',
  templateUrl: './test-drive-indemnity.component.html',
  styleUrls: ['./test-drive-indemnity.component.scss'],
})
export class TestDriveIndemnityComponent implements OnInit {
  td: Testdrive;
  pdpaForm: FormGroup;
  marketingConsent: string;
  dataConsent: string;
  pdpaTerms: string;
  tdTerms: string;
  needsPDPA: boolean;
  pdfBlob: Blob;
  sigImg: Blob;
  showSign: boolean;
  isSaving = false;

  @ViewChild(SignatureComponent) sigElem;

  constructor(
    private fb: FormBuilder,
    private tdService: CommonTestdriveService,
    private popover: PopoverController,
    private pdfSign: PDFSignService,
    private modal: ModalController,
    private err: ErrorService
  ) {
    try {
      this.pdpaForm = this.fb.group({
        dataConsent: [false],
        marketingConsent: [false],
      });
    } catch (err) {
      this.err.logError(err);
    }
  }

  ngOnInit() {
    if (this.needsPDPA) {
      this.pdpaForm.controls['dataConsent'].setValidators([Validators.requiredTrue]);
    }
  }

  saveSignature(evt) {
    if (!evt) {
      return;
    }
    this.isSaving = true;
    const height = this.needsPDPA ? 740 : 690;
    this.getPDFBlob()
      .pipe(
        mergeMap((pdfBlob) => {
          console.log(pdfBlob);
          return this.pdfSign.signPDF(90, height, 0, 200, 40, pdfBlob, evt);
        }),
        mergeMap((signedPDF) => {
          console.log(signedPDF);
          return this.tdService.saveSignedPDF(
            this.td,
            signedPDF,
            !this.needsPDPA || this.pdpaForm.get('dataConsent').value,
            !this.needsPDPA || this.pdpaForm.get('marketingConsent').value
          );
        })
      )
      .subscribe((res) => {
        this.td = res;
        this.isSaving = false;
        this.modal.dismiss(res);
      });
  }

  sign() {
    try {
      if (!this.pdpaForm.valid) {
        Object.values(this.pdpaForm.controls).forEach((ctrl) => {
          ctrl.markAsTouched({ onlySelf: true });
        });
        return;
      }
      this.showSign = true;
    } catch (err) {
      this.err.logError(err);
      this.err.presentServerErr(err);
    }
  }

  cancelSign() {
    try {
      this.showSign = false;
    } catch (err) {
      this.err.logError(err);
      this.err.presentServerErr(err);
    }
  }

  cancel() {
    try {
      this.modal.dismiss();
    } catch (err) {
      this.err.logError(err);
      this.err.presentServerErr(err);
    }
  }

  private getPDFBlob(): Observable<Blob> {
    return this.tdService.getBlankTDPDF(
      this.td,
      !this.needsPDPA || this.pdpaForm.get('marketingConsent').value,
      !this.needsPDPA || this.pdpaForm.get('dataConsent').value
    );
  }
}
