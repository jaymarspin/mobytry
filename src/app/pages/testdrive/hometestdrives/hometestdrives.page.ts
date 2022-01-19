import { Component, OnInit } from '@angular/core';
import { Testdrive } from 'src/app/models/common/testdrive.model';
import { Vehicle } from 'src/app/models/common/vehicle.model';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { EditTestdrivePageRoutingKeys } from '../edit-testdrive/edit-testdrive-routing.keys';
import { CommonTestdriveService } from 'src/app/services/common/testdrive/testdrive.service';
import { Subscription, from } from 'rxjs';
import { ViewTestdrivePageRoutingKeys } from '../view-testdrive/view-testdrive-routing.keys';
import { ModalController, LoadingController } from '@ionic/angular';
import { FilterTestdriveComponent } from './filter-testdrive/filter-testdrive/filter-testdrive.component';
import { TdFilterModel } from 'src/app/models/common/filter.model';
import { HomeTestdrivePageRoutingKeys } from './hometestdrives-routing.keys';
import { TranslateService } from '@ngx-translate/core';
import { mergeMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import * as _ from 'lodash';

import { AuthenticationService } from 'src/app/services/common/auth/auth.service';
import { UserInfo } from 'src/app/models/common/user.model';
import { ModelInterestSelectorComponent } from 'src/app/components/common/model-interest-selector/model-interest-selector.component';

import { CommonOpportunityService } from 'src/app/services/common/opportunity/opportunity.service';

@Component({
  selector: 'app-hometestdrives',
  templateUrl: './hometestdrives.page.html',
  styleUrls: ['./hometestdrives.page.scss'],
})
export class HometestdrivesPage implements OnInit {
  private subs = new Subscription();
  testdrives: Testdrive[];
  mytestdrives: Testdrive[];
  oppId: string;
  filterObj: TdFilterModel;
  countryCode = environment.countryCode;
  segment = 'mytestdrive';
  user: UserInfo;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private testdriveSrvc: CommonTestdriveService,
    private modalCtrl: ModalController,
    private translate: TranslateService,
    private loadingCtrl: LoadingController,
    private auth: AuthenticationService,
    private opportunityService: CommonOpportunityService
  ) {
    this.auth.subUser().subscribe((user) => {
      this.user = user;
      console.log(user);
    });
  }

  ngOnInit() {
    this.subs.add(this.parseURL());
  }

  parseURL() {
    return this.route.paramMap.subscribe((params) => {
      this.oppId = params.get(HomeTestdrivePageRoutingKeys.OPP_PARAM_ID);
      this.getTestdrives(null, null, this.segment);
    });
  }

  async getTestdrives(filter: TdFilterModel, oppId: string, segment: string) {
    return this.translate
      .get('Common_Loading')
      .pipe(
        mergeMap((lang) => {
          return from(
            this.loadingCtrl.create({
              message: lang,
            })
          );
        }),
        mergeMap((loading) => {
          loading.present();
          return this.testdriveSrvc.getTestdrives(filter, oppId, segment).pipe(
            tap(
              (e) => {
                if (segment === 'mytestdrive') {
                  this.mytestdrives = e;
                } else {
                  this.testdrives = e;
                }
                loading.dismiss();
              },
              (err) => {
                loading.dismiss();
              }
            )
          );
        })
      )
      .subscribe();
  }

  segmentChanged(ev: any) {
    this.getTestdrives(null, null, this.segment);
  }

  goToTestdrive(item: Testdrive) {
    this.router.navigate([`${ViewTestdrivePageRoutingKeys.BASE}/${item.Id}`]);
  }

  getColor(veh: Vehicle) {
    if (veh && this.checkStatus(veh.Status)) {
      return 'primary';
    }
  }

  getIcon(veh: Vehicle) {
    if (veh && this.checkStatus(veh.Status)) {
      return 'assets/icon/testdrive/active-td.svg';
    } else {
      return 'assets/icon/testdrive/inactive-td.svg';
    }
  }

  checkStatus(vehStatus: string) {
    return vehStatus === 'VEHICLE OUT' || vehStatus === 'SCHEDULED';
  }

  showFilter() {
    from(
      this.modalCtrl.create({
        component: FilterTestdriveComponent,
        backdropDismiss: false,
        animated: true,
        cssClass: 'full-screen',
        componentProps: {
          filterObj: this.filterObj ? Object.assign({}, this.filterObj) : null,
        },
      })
    ).subscribe((modal) => {
      from(modal.onDidDismiss()).subscribe((res: any) => {
        if (res && res.data) {
          this.filterObj = res.data;
          this.getTestdrives(this.filterObj, this.oppId, this.segment);
        }
      });
      modal.present();
    });
  }

  showModelInterestComp() {
    from(
      this.modalCtrl.create({
        component: ModelInterestSelectorComponent,
        componentProps: {
          cmp: '02',
          team: '',
          selectedValues: '',
          singleSelect: true,
        },
      })
    ).subscribe((modal) => {
      from(modal.onDidDismiss()).subscribe((modalData) => {
        if (modalData && modalData.data) {
          const selectedModel: Array<string> = modalData.data.map((model) => model.label);
          // if (
          //   JSON.stringify(this.oppForm.get('modelInterest').value) !==
          //   JSON.stringify(selectedModel)
          // ) {
          //   this.oppForm.get('modelInterest').setValue(selectedModel);
          //   this.oppForm.markAsDirty();
          // }
        }
      });
      modal.present();
    });
  }
}
