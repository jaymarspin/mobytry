export class CheckboxModel {
  isChecked: boolean;
  label: string;
  value: string;

  constructor(label: string, value?: string) {
    this.label = label;
    this.value = value;
    this.isChecked = false;
  }
}
