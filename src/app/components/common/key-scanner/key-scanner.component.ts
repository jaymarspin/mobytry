import { AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ScreenOrientation } from '@ionic-enterprise/screen-orientation/ngx';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { PopoverController } from '@ionic/angular';
import { from, of, Subscription } from 'rxjs';
import { delay, distinctUntilChanged, flatMap, map, switchMap, tap } from 'rxjs/operators';
import { KeyScan } from 'src/app/models/common/key-scan.model';
import { environment } from 'src/environments/environment';
import { ErrorService } from '../../../services/common/error/error.service';

@Component({
  selector: 'app-key-scanner',
  templateUrl: './key-scanner.component.html',
  styleUrls: ['./key-scanner.component.scss'],
})
export class KeyScannerComponent implements OnInit, OnDestroy, AfterViewInit {
  constructor(
    private qr: QRScanner,
    private el: ElementRef,
    private pop: PopoverController,
    private err: ErrorService,
    private orientation: ScreenOrientation
  ) {}

  @Output() scan = new EventEmitter<KeyScan>();
  private subs = new Subscription();
  private backdropBg;
  private backdropOpacity;
  private origBg;

  ngOnInit() {
    try {
      this.lockScreenIfPopover();
    } catch (err) {
      this.err.logError(err);
    }
  }

  ngAfterViewInit() {
    try {
      setTimeout(() => this.showCamera(), 400);
    } catch (err) {
      this.err.logError(err);
    }
  }

  ngOnDestroy() {
    try {
      this.subs.unsubscribe();
      this.qr.destroy();
    } catch (err) {
      this.err.logError(err);
    }
  }

  showCamera() {
    try {
      const qrScan = environment.emulator
        ? of('{"chassis":"WBS2U720X07E37591","model":"a0x9000000HFmvV","regNum":"T/PLATE"}').pipe(
            //TODO: detect this in globals?
            tap((_) => this.hideBackground()),
            delay(1000)
          )
        : from(this.qr.show()).pipe(
            switchMap((status: QRScannerStatus) => {
              if (status.showing) {
                this.hideBackground();
                return this.qr.scan();
              } else {
                throw new Error('Error showing camera');
              }
            })
          );
      const qrSub = qrScan
        .pipe(
          distinctUntilChanged(),
          map((res) => {
            const data = JSON.parse(res);
            const scan: KeyScan = Object.assign(new KeyScan(), data);
            if (!scan.model || !scan.chassis) {
              throw new Error('Invalid QR code');
            }
            qrSub.unsubscribe();
            this.showBackground();
            this.qr.hide();
            this.dismissPopover(scan);
            return scan;
          })
        )
        .subscribe(
          () => {},
          (err) => {
            qrSub.unsubscribe();
            this.showBackground();
            this.qr.hide();
            this.dismissPopover(null);
            this.err.logError(err);
            return this.err.presentServerErr(err);
          }
        );
    } catch (err) {
      this.err.logError(err);
      this.err.presentServerErr(err);
    }
  }

  close() {
    try {
      from(this.qr.pausePreview()).pipe(
        flatMap((_) => {
          return this.qr.hide();
        })
      );
      this.showBackground();
      this.dismissPopover(null);
    } catch (err) {
      this.err.logError(err);
      this.err.presentServerErr(err);
    }
  }

  reverseCamera() {
    try {
      from(this.qr.getStatus())
        .pipe(
          flatMap((status) => {
            if (!status.scanning) {
              return of(null);
            }
            const reverseCamera = status.currentCamera;
            if (reverseCamera === 0) {
              return this.qr.useCamera(1);
            } else {
              return this.qr.useCamera(0);
            }
          })
        )
        .subscribe(
          (_) => {},
          (err) => {
            this.err.logError(err);
            return this.err.presentServerErr(err);
          }
        );
    } catch (err) {
      this.err.logError(err);
      this.err.presentServerErr(err);
    }
  }

  toggleLight() {
    try {
      from(this.qr.getStatus())
        .pipe(
          flatMap((status) => {
            if (!status.scanning || !status.canEnableLight) {
              return of(null);
            }
            if (status.lightEnabled) {
              return this.qr.disableLight();
            } else {
              return this.qr.enableLight();
            }
          })
        )
        .subscribe(
          (_) => {},
          (err) => {
            this.err.logError(err);
            return this.err.presentServerErr(err);
          }
        );
    } catch (err) {
      this.err.logError(err);
      this.err.presentServerErr(err);
    }
  }

  private async dismissPopover(modelSelection: KeyScan) {
    const popover = await this.pop.getTop();
    if (popover) {
      await popover.dismiss(modelSelection);
      this.orientation.unlock();
    }
    return;
  }

  private hideBackground() {
    document.querySelectorAll('ion-app > :not(ion-popover)').forEach((x) => {
      x.classList.add('blurBg');
    });
    const popover = document.querySelector('ion-popover') as HTMLElement;
    if (popover) {
      this.origBg = popover.style.getPropertyValue('--background');
      popover.style.setProperty('--background', 'transparent');
      const popoverBg = popover.querySelector('ion-backdrop') as HTMLElement;
      const popoverParent = this.el.nativeElement.offsetParent;
      const offsetTop = popoverParent.offsetTop;
      const offsetBottom = offsetTop + popoverParent.offsetHeight;
      this.backdropBg = popoverBg.style.background;
      this.backdropOpacity = popoverBg.style.opacity;
      // tslint:disable-next-line:max-line-length
      popoverBg.style.background = `linear-gradient(to bottom, var(--ion-color-primary) 0, var(--ion-color-primary) ${offsetTop}px,transparent ${offsetTop}px, transparent ${offsetBottom}px, var(--ion-color-primary) ${offsetBottom}px, var(--ion-color-primary) 100vh) center/80vw 100vh no-repeat, linear-gradient(to bottom, var(--ion-color-primary) 0, var(--ion-color-primary) 100vh) left/10vw 100vh no-repeat, linear-gradient(to bottom, var(--ion-color-primary) 0, var(--ion-color-primary) 100vh) right/10vw 100vh no-repeat`;
      popoverBg.style.opacity = '1';
    }
  }

  private showBackground() {
    document.querySelectorAll('ion-app > :not(ion-popover)').forEach((x) => {
      x.classList.remove('blurBg');
    });
    const popover = document.querySelector('ion-popover') as HTMLElement;
    if (popover) {
      if (this.origBg) {
        popover.style.setProperty('--background', this.origBg);
      }
      const popoverBg = popover.querySelector('ion-backdrop') as HTMLElement;
      if (popoverBg) {
        popoverBg.style.background = this.backdropBg;
        popoverBg.style.opacity = this.backdropOpacity;
      }
    }
  }

  private async lockScreenIfPopover() {
    const popover = await this.pop.getTop();
    if (popover) {
      this.orientation.lock(this.orientation.type);
    }
    return;
  }
}
