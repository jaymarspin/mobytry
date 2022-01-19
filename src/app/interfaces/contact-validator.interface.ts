import { FormGroup } from '@angular/forms';
import { FormErrorMessages } from '../models/common/form-error.model';

export interface IContactValidator {
  setMobileValidator(form: FormGroup, messages: FormErrorMessages): FormGroup;
  setIDValidator(form: FormGroup, messages: FormErrorMessages): FormGroup;
}
