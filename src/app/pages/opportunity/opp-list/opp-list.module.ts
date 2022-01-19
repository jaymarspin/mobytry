import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FilterOpportunityComponent } from './component/filter-opportunity/filter-opportunity.component';
import { OppListPageRoutingModule } from './opp-list-routing.module';
import { OppListPage } from './opp-list.page';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule, OppListPageRoutingModule, TranslateModule],
  declarations: [OppListPage, FilterOpportunityComponent],
})
export class OppListPageModule {}
