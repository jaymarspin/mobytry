export class AutoCompleteModel {
  Title: string;
  Label: string;
  Note?: string;
  constructor(values: object = {}) {
    Object.assign(this, values);
  }
}
