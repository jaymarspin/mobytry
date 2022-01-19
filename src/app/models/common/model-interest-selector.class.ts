export class CheckboxModel {
  isChecked: boolean;
  label: string;

  constructor(label: string) {
    this.label = label;
    this.isChecked = false;
  }
}
