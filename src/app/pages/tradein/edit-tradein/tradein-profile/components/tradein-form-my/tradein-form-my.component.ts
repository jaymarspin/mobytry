import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChange } from '@angular/core';
import { TradeIn } from 'src/app/models/common/tradein.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FormErrorMessages } from 'src/app/models/common/form-error.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-tradein-form-my',
  templateUrl: './tradein-form-my.component.html',
  styleUrls: ['./tradein-form-my.component.scss'],
})
export class TradeinFormMyComponent implements OnInit, OnChanges {
  @Input() form: FormGroup;
  @Input() messages: FormErrorMessages;
  @Input() tradein: TradeIn;
  @Output() tdChange = new EventEmitter<TradeIn>();

  constructor(private translate: TranslateService) {}

  ngOnInit() {
    this.addToForm();
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {}

  emit() {
    this.tradein.Chassis = this.form.get('chassis').value;
    this.tradein.RegDate = this.form.get('regDate').value;
    this.tradein.YearMake = this.form.get('yearMake').value;
    this.tradein.Make = this.form.get('make').value;
    this.tradein.Model = this.form.get('model').value;
    this.tradein.Variant = this.form.get('variant').value;
    this.tradein.Color = this.form.get('color').value;
    this.tradein.TradeInSource = this.form.get('tradeInSource').value;
    this.tradein.ExpectedPrice = this.form.get('expectedPrice').value;
    this.tradein.Overtrade = this.form.get('overtrade').value;
    this.tradein.Warranty = this.form.get('warranty').value;
    this.tdChange.emit(this.tradein);
  }

  private addToForm() {
    if (!this.form) {
      return;
    }
    this.form.addControl('chassis', new FormControl('', [Validators.required]));
    this.form.addControl('regDate', new FormControl('', [Validators.required]));
    this.form.addControl('yearMake', new FormControl(''));
    this.form.addControl('make', new FormControl('', [Validators.required]));
    this.form.addControl('model', new FormControl('', [Validators.required]));
    this.form.addControl('variant', new FormControl(''));
    this.form.addControl('color', new FormControl(''));
    this.form.addControl('tradeInSource', new FormControl('', [Validators.required]));
    this.form.addControl('expectedPrice', new FormControl(''));
    this.form.addControl('overtrade', new FormControl(''));
    this.form.addControl('warranty', new FormControl(''));
    this.updateFormMsg();
  }

  private updateFormMsg() {
    this.translate.get('Error_CannotBeEmpty').subscribe((lang) => {
      this.messages.chassis = {
        required: lang,
      };
      this.messages.make = {
        required: lang,
      };
      this.messages.model = {
        required: lang,
      };
      this.messages.tradeInSource = {
        required: lang,
      };
    });
  }
}
