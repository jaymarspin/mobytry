import { ValidatorFn, AbstractControl, FormGroup, Validators } from '@angular/forms';
import { IContactValidator } from 'src/app/interfaces/contact-validator.interface';
import { FormErrorMessages } from 'src/app/models/common/form-error.model';

export class ContactMYValidators implements IContactValidator {
  setMobileValidator(form: FormGroup, messages: FormErrorMessages) {
    const formCtrl = form.get('mobile');
    if (!formCtrl) {
      return form;
    }
    const existingValidators = formCtrl.validator ? [formCtrl.validator] : [];
    formCtrl.setValidators([...existingValidators, validateMYMobile()]);
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
    const existingValidators = formCtrl.validator ? [formCtrl.validator] : [];
    formCtrl.setValidators([...existingValidators]);
    return form;
  }
}

export function validateMYMobile(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!control.value || control.value.length <= 0) {
      return null;
    }
    const err = { mobileError: { value: control.value } };
    if (control.value.length < 9) {
      return err;
    }
    return null;
  };
}
