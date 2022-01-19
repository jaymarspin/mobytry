import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-item-err',
  templateUrl: './item-err.component.html',
  styleUrls: ['./item-err.component.scss'],
})
export class ItemErrComponent implements OnInit {
  @Input() size: 'small' | 'large';
  @Input() control: AbstractControl;
  @Input() messages: { [key: string]: string };
  constructor() {}

  ngOnInit() {
    this.size = this.size || 'small';
  }

  getErrors(): string[] {
    if (!this.control || !this.messages || !this.control.errors) {
      return [];
    }
    const errors = Object.keys(this.control.errors);
    const rv = [];
    if (errors) {
      errors.forEach((e) => {
        const msg = this.messages[e];
        if (msg) {
          rv.push(msg);
        }
      });
    }
    return rv;
  }
}
