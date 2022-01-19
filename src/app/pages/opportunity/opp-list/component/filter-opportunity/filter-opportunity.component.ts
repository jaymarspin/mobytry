import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SelectOption } from 'src/app/models/common/select-option.model';
import { CommonOpportunityService } from 'src/app/services/common/opportunity/opportunity.service';
import { TranslateService } from '@ngx-translate/core';
import { OppFilterModel } from 'src/app/models/common/filter.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FormErrorMessages } from 'src/app/models/common/form-error.model';

@Component({
  selector: 'app-filter-opportunity',
  templateUrl: './filter-opportunity.component.html',
  styleUrls: ['./filter-opportunity.component.scss'],
})
export class FilterOpportunityComponent implements OnInit {
  filterForm: FormGroup;
  @Input() filterObj: OppFilterModel;
  sources: SelectOption[];
  starred = this.opportunitySrvc.getStarredFilterOptions();

  constructor(
    private modalCtrl: ModalController,
    private opportunitySrvc: CommonOpportunityService,
    private formBuilder: FormBuilder,
    private translate: TranslateService
  ) {
    this.filterForm = this.initFilterForm();
  }

  ngOnInit() {
    if (!this.filterObj) {
      this.reset();
    } else {
      this.updateForm();
    }
  }

  private initFilterForm(): FormGroup {
    const oppForm = this.formBuilder.group({
      source: [''],
      starred: [''],
      startDate: [''],
      endDate: [''],
      withOpenBookings: [false],
      withPendingTasks: [false],
      withAppointment: [false],
    });
    return oppForm;
  }

  getData() {}

  reset() {
    this.filterObj = {
      tdStatus: 'all',
      oppStatus: 'all',
      leadStatus: 'all',
      oppSource: '',
      starredOpp: 'All',
      startDate: '',
      endDate: '',
      withOpenBookings: false,
      withAppointment: false,
      withPendingTasks: false,
    };
    this.updateForm();
  }

  updateForm() {
    if (this.filterForm) {
      this.filterForm.reset(
        {
          source: this.filterObj.oppSource,
          starred: this.filterObj.starredOpp,
          startDate: this.filterObj.startDate,
          endDate: this.filterObj.endDate,
          withOpenBookings: this.filterObj.withOpenBookings,
          withPendingTasks: this.filterObj.withPendingTasks,
          withAppointment: this.filterObj.withAppointment,
        },
        { emitEvent: true }
      );
    }
  }

  apply() {
    this.modalCtrl.dismiss(this.filterObj);
  }

  cancel() {
    this.modalCtrl.dismiss();
  }

  getOpenIcon() {
    if (this.filterObj.oppStatus === 'open') {
      return 'assets/icon/opportunity/unlock.svg';
    } else {
      return 'assets/icon/opportunity/unlock-disabled.svg';
    }
  }

  getUpcomingIcon() {
    if (this.filterObj.tdStatus === 'upcoming') {
      return 'assets/icon/opportunity/upcoming.svg';
    } else {
      return 'assets/icon/opportunity/upcoming-disabled.svg';
    }
  }

  updateOppStatus(type: string) {
    if (type === 'open') {
      this.filterObj.oppStatus = 'open';
    } else if (type === 'deferred') {
      this.filterObj.oppStatus = 'deferred';
    } else if (type === 'all') {
      this.filterObj.oppStatus = 'all';
    } else {
      this.filterObj.oppStatus = 'won';
    }
  }

  updateLeadStatus(type: string) {
    if (type === 'cold') {
      this.filterObj.leadStatus = 'cold';
    } else if (type === 'hot') {
      this.filterObj.leadStatus = 'hot';
    } else if (type === 'all') {
      this.filterObj.leadStatus = 'all';
    } else {
      this.filterObj.leadStatus = 'warm';
    }
  }

  updateTdStatus(type: string) {
    if (type === 'ongoing') {
      this.filterObj.tdStatus = 'ongoing';
    } else if (type === 'upcoming') {
      this.filterObj.tdStatus = 'upcoming';
    } else if (type === 'all') {
      this.filterObj.tdStatus = 'all';
    } else {
      this.filterObj.tdStatus = 'completed';
    }
  }
}
