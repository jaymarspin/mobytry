import { HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { from, Observable, of } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import * as Rollbar from 'rollbar';
import { RollbarService } from 'src/app/services/common/rollbar/rollbar';

import { ScriptService } from 'src/app/services/common/rollbar/script.service';

@Injectable({ providedIn: 'root' })
export class ErrorService {
  private static VALIDATION_ERR = 'FIELD_CUSTOM_VALIDATION_EXCEPTION';
  private static ERR_MSG_LEN = 80;
  constructor(private toastCtrl: ToastController,
    private rollbarScript: ScriptService,
    @Inject(RollbarService) private rollbar: Rollbar,
    ) {
      // this.rollbarScript.shellCommand().subscribe({
      //   next: data =>{
      //     console.log(data)
   
      //   },error: err =>{
      //     console.log(err)
      //   }
      // })
    }

  handleError(error: any) {
    // TODO: add in rollbar logging later on
    this.rollbar.error(new Error(error.message).stack)
    this.rollbar.debug(error)
    // console.error(error);
  }

  logError(error: any) {
    // TODO: add in rollbar logging later on
    this.rollbar.log(new Error(error.message).stack) 
    console.error(error);
  }

  presentServerErr(errObj): Observable<HTMLIonToastElement> {
    const errMsg = this.getErrMsg(errObj);
    const rv = from(
      this.toastCtrl.create({
        message: errMsg,
        buttons: [
          {
            side: 'end',
            icon: 'close',
            text: '',
            role: 'cancel',
            handler: () => {
              console.log('Favorite clicked');
            },
          },
        ],
        position: 'top',
        color: 'danger',
        animated: true,
        duration: 8000,
        keyboardClose: true,
      })
    ).pipe(
      flatMap((toast, _) => {
        toast.present();
        return of(toast);
      })
    );
    rv.subscribe(() => {});
    return rv;
  }

  public getErrMsg(errObj): string {
    let errMsg = '';
    if (errObj instanceof Array && errObj.length > 0) {
      errObj = errObj[0];
    }
    if (errObj instanceof HttpErrorResponse) {
      errMsg = this.getErrMsgFromHttpErr(errObj.error);
    } else if (typeof errObj === 'string') {
      errMsg = errObj;
    } else if (errObj instanceof Error) {
      errMsg = `${errObj.name}: ${errObj.message}`;
    } else {
      errMsg = 'An unexpected error has occurred.';
    }
    errMsg = errMsg.length > ErrorService.ERR_MSG_LEN ? `${errMsg.substr(0, ErrorService.ERR_MSG_LEN - 3)}...` : errMsg;
    return errMsg;
  }

  public getErrMsgFromHttpErr(e: any): string {
    if (e instanceof Array && e.length > 0) {
      e = e[0];
    }
    if (e.errorCode && e.errorCode === ErrorService.VALIDATION_ERR) {
      if (e.messsage) {
        return e.message;
      } else {
        return e.errorCode;
      }
    } else if (e.err) {
      const exceptionInd: number = e.err.indexOf(ErrorService.VALIDATION_ERR);
      if (exceptionInd > 0) {
        let errStr = e.err.substring(exceptionInd + ErrorService.VALIDATION_ERR.length);
        errStr = errStr.replace(/^\W+/g, '');
        return errStr;
      } else {
        return e.err;
      }
    } else if (e.message) {
      return e.message;
    } else {
      return 'Error in HTTP call.';
    }
  }
}
