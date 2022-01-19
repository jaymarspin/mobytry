import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { IonSearchbar, ModalController } from '@ionic/angular';
import { VehicleModel } from 'src/app/models/common/vehicle-model.model';
import { TestdriveServiceSG } from 'src/app/services/sg/testdrive/testdrive.service';
import { CheckboxModel } from '../../../models/common/model-interest-selector.model';
import { ErrorService } from '../../../services/common/error/error.service';
import { OpportunityServiceSG } from '../../../services/sg/opportunity/opportunity-sg.service';

@Component({
  selector: 'model-interest-selector',
  templateUrl: './model-interest-selector.component.html',
  styleUrls: ['./model-interest-selector.component.scss'],
})
export class ModelInterestSelectorComponent implements OnInit {
  @ViewChild(IonSearchbar) searchbar: IonSearchbar;
  @Input() cmp: string;
  @Input() team: string;
  @Input() selectedValues: Array<string>;
  @Input() singleSelect: boolean;
  @Output() selectedResult = new EventEmitter<any>();

  public searchInput: string;
  public searchResult: Array<CheckboxModel>;
  public modelSelected: Array<CheckboxModel>;
  public modelList: Array<CheckboxModel>;
  public isLoading = true;
  private vehModel: Array<VehicleModel>;
  constructor(private modalCtrl: ModalController, private err: ErrorService, private oppService: OpportunityServiceSG, private tdService: TestdriveServiceSG) {}

  ngOnInit() {
    if (!this.modelList || this.modelList.length <= 0) {
      (this.singleSelect ? this.tdService.retrieveTDModels(new Set([this.cmp])) : this.oppService.retrieveVehModelInt(new Set([this.cmp]))).subscribe(
        (res) => {
          this.vehModel = res;
          this.modelList = new Array<CheckboxModel>();
          if (this.vehModel) {
            const filteredRes: string[] = [];
            for (const model of this.vehModel) {
              if (filteredRes.indexOf(model.ShortDescription) < 0) {
                filteredRes.push(model.ShortDescription);
                this.modelList.push(new CheckboxModel(model.ShortDescription, model.Id));
              }
            }
          }
          this.preselectValues();
          if (!this.searchResult) {
            this.searchResult = this.modelList;
          }
          this.isLoading = false;
        },
        (err) => {
          this.err.logError(err);
          this.isLoading = false;
        }
      );
    } else {
      this.isLoading = false;
      this.preselectValues();
      if (!this.searchResult) {
        this.searchResult = this.modelList;
      }
    }
  }

  checkSingle(label: string) {
    if (this.singleSelect) {
      this.modelList.forEach((model) => {
        if (model.isChecked && label !== model.label) {
          model.isChecked = false;
        }
      });
    }
  }

  search(evt: Event) {
    if (!evt || !evt.target) {
      return;
    }
    const target = evt.target as HTMLInputElement;
    let keyword = target.value;
    this.isLoading = true;
    if (keyword && keyword.trim()) {
      keyword = keyword.trim();
      this.getData(keyword);
    } else {
      this.searchResult = this.modelList;
    }
    this.isLoading = false;
  }

  getData(key?: string) {
    if (!this.modelList) {
      return;
    }
    this.isLoading = true;
    this.searchResult = this.modelList.filter((val) => {
      if (val.label.toUpperCase().indexOf(key.toUpperCase()) >= 0) {
        return val;
      }
    });
  }

  dismiss(selectedModels?: Array<CheckboxModel>) {
    if (selectedModels) {
      this.selectedResult.emit(selectedModels);
      this.modalCtrl.dismiss(selectedModels);
    } else {
      this.modalCtrl.dismiss();
    }
  }

  save() {
    this.modelSelected = this.modelList.filter((val) => {
      return val.isChecked;
    });
    this.dismiss(this.modelSelected);
  }

  private preselectValues() {
    if (this.selectedValues) {
      this.selectedValues.forEach((selectedModel) => {
        this.modelList.forEach((model) => {
          if (selectedModel.toUpperCase() === model.label.toUpperCase()) {
            model.isChecked = true;
          }
        });
      });
    }
  }
}
