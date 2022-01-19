import { Component, OnInit, ViewChild, Input, Output, EventEmitter, AfterViewInit, ViewChildren, QueryList, OnDestroy, ElementRef } from '@angular/core';
import SignaturePad from 'signature_pad';
import { PopoverController } from '@ionic/angular';
import { ErrorService } from '../../../services/common/error/error.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signature',
  templateUrl: './signature.component.html',
  styleUrls: ['./signature.component.scss'],
})
export class SignatureComponent implements OnInit, AfterViewInit, OnDestroy {
  signature: SignaturePad;

  @Output()
  sigBlob = new EventEmitter<Blob>();

  @Input()
  sigTitle: string;

  @Input()
  showConfirm: boolean;

  @Input()
  showClear: boolean;

  private sub = new Subscription();
  constructor(private el: ElementRef, private pop: PopoverController, private err: ErrorService) {}

  ngOnInit() {
    try {
      this.sigTitle = this.sigTitle ? this.sigTitle : 'Signature';
    } catch (err) {
      this.err.logError(err);
    }
  }

  ngOnDestroy() {
    try {
      this.sub.unsubscribe();
    } catch (err) {
      this.err.logError(err);
    }
  }

  ngAfterViewInit() {
    try {
      this.signature = new SignaturePad(this.el.nativeElement.querySelector('canvas'));
    } catch (err) {
      this.err.logError(err);
    }
  }

  clear() {
    try {
      this.signature.clear();
    } catch (err) {
      this.err.logError(err);
      this.err.presentServerErr(err);
    }
  }

  sign() {
    try {
      const b = this.getSigBlob();
      this.sigBlob.emit(b);
      this.dismissPopover(b);
    } catch (err) {
      this.err.logError(err);
      this.err.presentServerErr(err);
    }
  }

  private getSigBlob(): Blob {
    const base64ImgData = this.signature.toDataURL();
    return this.convertBase64ToBlob(base64ImgData.split(',')[1], 'image/png');
  }

  private async dismissPopover(b: Blob) {
    const popover = await this.pop.getTop();
    if (popover) {
      await popover.dismiss(b);
    }
    return;
  }

  private convertBase64ToBlob(data: string, formatType: string): Blob {
    const byteString = atob(data);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: formatType });
  }
}
