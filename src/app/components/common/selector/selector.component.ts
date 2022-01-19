import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SelectOption } from 'src/app/models/common/select-option.model';

@Component({
  selector: 'app-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss'],
})
export class SelectorComponent implements OnInit {
  @Input() selectors: SelectOption[];
  @Input() allowMultiple: boolean;
  @Input() header: string;
  @Input() selected: SelectOption[];
  searchInput: string;
  selectorsArr: SelectOption[];

  @Output() options = new EventEmitter<SelectOption[]>();

  private selectedOptions = new Array<SelectOption>();
  constructor(private modalController: ModalController) {}

  ngOnInit() {
    this.selectorsArr = this.selectors;
    this.getPreviousSelected();
  }

  getPreviousSelected(): void {
    if (this.selected.length > 0) {
      this.selected.forEach((s: SelectOption) => this.toggle(s));
    }
  }

  isSelected(s: SelectOption): boolean {
    return this.check(s);
  }

  toggle(opt: SelectOption) {
    if (this.check(opt)) {
      this.delete(opt);
    } else {
      if (this.allowMultiple) {
        this.selectedOptions.push(opt);
      } else {
        this.selectedOptions = new Array<SelectOption>();
        this.selectedOptions.push(opt);
        this.save();
      }
    }
  }

  check(obj: SelectOption) {
    return this.selectedOptions.some((item) => item.value === obj.value);
  }

  delete(obj: SelectOption) {
    this.selectedOptions = this.selectedOptions.filter((item) => item.value !== obj.value);
  }

  cancel() {
    this.modalController.dismiss();
  }

  save() {
    this.options.emit(this.selectedOptions);
    this.modalController.dismiss({
      selection: this.selectedOptions,
    });
  }

  searchSelectors(evt: Event) {
    if (!evt || !evt.target) {
      return;
    }
    const target = evt.target as HTMLInputElement;
    if (!target.value) {
      return;
    }
    const keyword = target.value;
    this.selectorsArr = this.selectors;
    if (keyword && keyword.trim() !== '') {
      this.selectorsArr = this.selectors.filter((option: SelectOption) => {
        return option.label.toLocaleLowerCase().indexOf(keyword.toLowerCase()) > -1;
      });
    }
  }
}
