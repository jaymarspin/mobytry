import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { FormErrorMessages } from 'src/app/models/common/form-error.model';
import { Testdrive } from 'src/app/models/common/testdrive.model';
import { TestdriveSG } from 'src/app/models/sg/testdrive-sg.model';
import { CommonContactService } from 'src/app/services/common/contact/contact.service';

@Component({
  selector: 'app-tdform-sg',
  templateUrl: './tdform-sg.component.html',
  styleUrls: ['./tdform-sg.component.scss'],
})
export class TdformSgComponent implements OnInit, OnChanges {
  @Input() form: FormGroup;
  @Input() messages: FormErrorMessages;
  @Input() testdrive: Testdrive;
  @Output() tdChange = new EventEmitter<TestdriveSG>();
  countryList = this.contactService.getCountryList();
  testDriveSG: TestdriveSG;

  constructor(private translate: TranslateService, private contactService: CommonContactService) {}

  ngOnInit() {
    this.addToForm();
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (changes.testdrive) {
      this.testDriveSG = changes.testdrive.currentValue as TestdriveSG;
    }
  }

  emit() {
    this.testDriveSG.Line1 = this.form.get('line1').value;
    this.testDriveSG.Line2 = this.form.get('line2').value;
    this.testDriveSG.PostalCode = this.form.get('postalCode').value;
    this.testDriveSG.Country = this.form.get('country').value;
    this.tdChange.emit(this.testDriveSG);
  }

  private addToForm() {
    if (!this.form) {
      return;
    }
    this.form.addControl('line1', new FormControl('', [Validators.required]));
    this.form.addControl('line2', new FormControl(''));
    this.form.addControl('country', new FormControl(null));
    this.form.addControl('postalCode', new FormControl('', [Validators.required]));
    this.updateFormMsg();
  }

  private updateFormMsg() {
    this.translate.get('Error_CannotBeEmpty').subscribe((lang) => {
      this.messages.line1 = {
        required: lang,
      };
      this.messages.postalCode = {
        required: lang,
      };
    });
  }

  // async showModelPopover() {
  //   try {
  //     const popover = await this.popover.create({
  //       component: ModelSelectorComponent,
  //       showBackdrop: true,
  //       cssClass: 'full-popover',
  //       backdropDismiss: false,
  //       animated: false,
  //       componentProps: {
  //         modelList: this.tdModels,
  //         company: this.cmp,
  //       },
  //     });
  //     popover.present();
  //     const popoverData = await popover.onDidDismiss();
  //     if (!popoverData || !popoverData.data) {
  //       return;
  //     }
  //     const curModel = popoverData.data;
  //     if (curModel && !this.models.some((x) => x.Id === curModel.Id)) {
  //       this.models.push(curModel);
  //     }
  //     if (!this.cmp && curModel.company.Name && curModel.company.Id) {
  //       this.cmp = Object.assign(new Company(), curModel.company);
  //     }
  //   } catch (err) {
  //     this.err.logError(err);
  //     this.err.presentServerErr(err);
  //   }
  // }
}
