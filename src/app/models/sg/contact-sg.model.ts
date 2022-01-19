import { ContactModel } from '../common/contact.model';

export class ContactModelSG extends ContactModel {
  constructor(values: object = {}) {
    super(values);
    Object.assign(this, values);
  }
}
