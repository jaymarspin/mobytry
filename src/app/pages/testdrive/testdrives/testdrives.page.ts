import { Component, OnInit } from '@angular/core';
import { Testdrive, Vehicle } from 'src/app/models/common/testdrive.model';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { EditTestdrivePageRoutingKeys } from '../edit-testdrive/edit-testdrive-routing.keys';
import { CommonTestdriveService } from 'src/app/services/common/testdrive/testdrive.service';
import { Subscription, from } from 'rxjs';
import { ViewTestdrivePageRoutingKeys } from '../view-testdrive/view-testdrive-routing.keys';
import { ModalController, LoadingController } from '@ionic/angular';
import { FilterTestdriveComponent } from './filter-testdrive/filter-testdrive.component';
import { TdFilterModel } from 'src/app/models/common/filter.model';
import { TestdrivePageRoutingKeys } from './testdrive-routing.keys';
import { TranslateService } from '@ngx-translate/core';
import { mergeMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-testdrives',
  templateUrl: './testdrives.page.html',
  styleUrls: ['./testdrives.page.scss'],
})
export class TestdrivesPage implements OnInit {
  private subs = new Subscription();
  testdrives: Testdrive[];
  oppId: string;
  filterObj: TdFilterModel;
  countryCode = environment.countryCode;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private testdriveSrvc: CommonTestdriveService,
    private modalCtrl: ModalController,
    private translate: TranslateService,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.subs.add(this.parseURL());
  }

  parseURL() {
    return this.route.paramMap.subscribe((params) => {
      this.oppId = params.get(TestdrivePageRoutingKeys.PARAM_ID);
      if (this.oppId === TestdrivePageRoutingKeys.PARAM_ID) {
        this.oppId = '';
      }
      this.getTestdrives(null, this.oppId);
    });
  }

  getTestdrives(filter: TdFilterModel, oppId: string) {
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
          return this.testdriveSrvc.getTestdrives(filter, oppId).pipe(
            tap(
              (e) => {
                this.testdrives = e;
                console.log(this.testdrives);
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

  add() {
    const state = new Object();
    state[EditTestdrivePageRoutingKeys.STATE_OPPID] = this.oppId;
    const navigationExtras: NavigationExtras = {
      state,
    };
    this.router.navigate([`${EditTestdrivePageRoutingKeys.BASE}/${EditTestdrivePageRoutingKeys.PARAM_ID}`], navigationExtras);
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
          this.getTestdrives(this.filterObj, this.oppId);
        }
      });
      modal.present();
    });
  }
}
