import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Tab3PageRoutingModule } from './tab3-routing.module';

import { Tab3Page } from './tab3.page';
import { TranslateModule } from '@ngx-translate/core';
import { SelectorComponentModule } from 'src/app/components/common/selector/selector.module';
import { FilterOpportunityComponent } from './component/filter-opportunity/filter-opportunity.component';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule, TranslateModule, Tab3PageRoutingModule],
  declarations: [Tab3Page, FilterOpportunityComponent],
})
export class Tab3PageModule {}
