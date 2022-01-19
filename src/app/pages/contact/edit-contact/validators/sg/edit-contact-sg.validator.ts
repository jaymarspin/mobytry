import { ValidatorFn, AbstractControl, FormGroup, Validators } from '@angular/forms';
import { IContactValidator } from 'src/app/interfaces/contact-validator.interface';
import { FormErrorMessages } from 'src/app/models/common/form-error.model';

export class ContactSGValidators implements IContactValidator {
  setMobileValidator(form: FormGroup, messages: FormErrorMessages) {
    const formCtrl = form.get('mobile');
    if (!form) {
      return;
    }
    const existingValidators = formCtrl.validator ? [formCtrl.validator] : [];
    formCtrl.setValidators([...existingValidators, Validators.minLength(8), Validators.maxLength(8), validateSGMobile()]);
    const existingErr = messages[`mobile`] ? messages[`mobile`] : {};
    messages[`mobile`] = {
      ...existingErr,
      mobileError: 'Invalid Mobile Number.',
    };
    return form;
  }

  setIDValidator(form: FormGroup, messages: FormErrorMessages) {
    const formCtrl = form.get('docNum');
    if (!form) {
      return;
    }
    if (form.get('docType').value.toLocaleLowerCase().includes('nric')) {
      const existingValidators = formCtrl.validator ? [formCtrl.validator] : [];
      formCtrl.setValidators([...existingValidators, nricValidator]);
      const existingErr = messages[`docNum`] ? messages[`docNum`] : {};
      messages[`docNum`] = {
        ...existingErr,
        nricValidator: 'Invalid NRIC.',
      };
    } else {
      formCtrl.setValidators([]);
    }
    return form;
  }
}

export function validateSGMobile(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!control.value || control.value.length <= 0) {
      return null;
    }
    const err = { mobileError: { value: control.value } };
    if (control.value.length !== 8) {
      return err;
    }
    if (!control.value.startsWith('9') && !control.value.startsWith('8')) {
      return err;
    }
    return null;
  };
}

export function nricValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (control.value == null || control.value.length <= 0) {
      return null;
    }
    const err = { nricValidator: { value: control.value } };
    if (control.value.length !== 9) {
      return err;
    }
    let sum = ['T', 'G'].includes(control.value[0]) ? 4 : 0;
    let multiplier;
    for (let i = 1; i < control.value.length - 1; i++) {
      multiplier = i === 1 ? 2 : control.value.length - i;
      sum += control.value[i] * multiplier;
    }
    const rem = sum % 11;
    let isErr;
    if (['S', 'T'].includes(control.value[0])) {
      const remSOrT = ['J', 'Z', 'I', 'H', 'G', 'F', 'E', 'D', 'C', 'B', 'A'];
      isErr = remSOrT[rem] !== control.value[control.value.length - 1];
    } else if (['F', 'G'].includes(control.value[0])) {
      const remFOrG = ['X', 'W', 'U', 'T', 'R', 'Q', 'P', 'N', 'M', 'L', 'K'];
      isErr = remFOrG[rem] !== control.value[control.value.length - 1];
    } else {
      isErr = true;
    }
    return isErr ? err : null;
  };
}
