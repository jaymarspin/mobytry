import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { from, Observable } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import { OppFilterModel } from 'src/app/models/common/filter.model';
import { InfiniteScrollModel } from 'src/app/models/common/infinite-scroll.model';
import { Opportunity } from 'src/app/models/common/opportunity.model';
import { CommonOpportunityService } from 'src/app/services/common/opportunity/opportunity.service';
import { environment } from 'src/environments/environment';
import { OpportunityDetailsPageRoutingKeys } from '../../opportunity/opportunity-details/opportunity-details-routing.keys';
import { FilterOpportunityComponent } from './component/filter-opportunity/filter-opportunity.component';

@Component({
  selector: 'app-opp-list',
  templateUrl: './opp-list.page.html',
  styleUrls: ['./opp-list.page.scss'],
})
export class OppListPage implements OnInit {
  infOpp: Observable<InfiniteScrollModel<Opportunity[]>>;
  searchInput: string;
  opp: Opportunity[];
  filterObj: OppFilterModel;
  countryCode = environment.countryCode;
  isLoadingRecent = false;

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
    this.isLoadingRecent = true;
    this.opportunityService
      .getOppInfinite()
      .pipe(
        tap(
          (e) => {
            this.infOpp = e.next;
            this.opp = e.result;
            this.isLoadingRecent = false;
          },
          (err) => {
            this.isLoadingRecent = false;
          }
        )
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
            return this.opportunityService.getOppInfinite(this.searchInput).pipe(
              tap(
                (e) => {
                  this.infOpp = e.next;
                  this.opp = e.result;
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

  doInfinite(event) {
    if (!this.infOpp) {
      event.target.disabled = true;
      return;
    }
    this.infOpp.subscribe(
      (res) => {
        this.opp = this.opp.concat(res.result);
        this.infOpp = res.next;
        event.target.complete();
      },
      (err) => {
        // this.errService.logError(err);
        // this.errService.presentServerErr(err);
      }
    );
    // this.infOpp.next.pipe(
    //   tap((res) => {
    //     if (res.result) {
    //       this.opp.push(...res.result);
    //       this.infOpp = res;
    //     } else {
    //       event.target.disabled = true;
    //     }
    //   })
    // ).subscribe();
    // event.target.complete();
  }
}
