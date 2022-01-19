import { Component, OnInit } from '@angular/core';
import { Opportunity } from 'src/app/models/common/opportunity.model';
import { CommonOpportunityService } from 'src/app/services/common/opportunity/opportunity.service';
import { Router } from '@angular/router';
import { OpportunityDetailsPageRoutingKeys } from '../../opportunity/opportunity-details/opportunity-details-routing.keys';
import { ModalController, LoadingController } from '@ionic/angular';
import { FilterOpportunityComponent } from './component/filter-opportunity/filter-opportunity.component';
import { from } from 'rxjs';
import { OppFilterModel } from 'src/app/models/common/filter.model';
import { TranslateService } from '@ngx-translate/core';
import { mergeMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss'],
})
export class Tab3Page implements OnInit {
  searchInput: string;
  opp: Opportunity[];
  filterObj: OppFilterModel;

  constructor(
    private opportunityService: CommonOpportunityService,
    private router: Router,
    private modalCtrl: ModalController,
    private translate: TranslateService,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.getOpportunities(null);
  }

  getOpportunities(filter: OppFilterModel) {
    this.translate
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
          return this.opportunityService.getOpportunities(filter).pipe(
            tap(
              (e) => {
                this.opp = e;
                console.log(this.opp);
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

  search() {
    if (this.searchInput && this.searchInput.trim()) {
      this.translate
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
            return this.opportunityService.getOpportunityByKeyword(this.searchInput).pipe(
              tap(
                (e) => {
                  this.opp = e;
                  console.log(this.opp);
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
    } else {
      this.getOpportunities(null);
    }
  }

  getColor(warmth: number) {
    if (warmth === 100) {
      return 'danger';
    } else if (warmth < 1) {
      return 'secondary';
    } else {
      return 'warning';
    }
  }

  goToOpportunity(opp: Opportunity) {
    this.router.navigate([`${OpportunityDetailsPageRoutingKeys.BASE}/` + opp.Id]);
  }

  getFavIcon(opp: Opportunity) {
    if (opp.Flag) {
      return 'star';
    } else {
      return 'star-outline';
    }
  }

  showFilter() {
    from(
      this.modalCtrl.create({
        component: FilterOpportunityComponent,
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
          this.getOpportunities(this.filterObj);
        }
      });
      modal.present();
    });
  }
}
