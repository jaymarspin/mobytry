import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OpportunityDetailsPageRoutingModule } from './opportunity-details-routing.module';

import { OpportunityDetailsPage } from './opportunity-details.page';
import { TranslateModule } from '@ngx-translate/core';
import { SelectorComponentModule } from 'src/app/components/common/selector/selector.module';
import { ItemErrComponentModule } from 'src/app/components/common/item-err/item-err.module';
import { ModelInterestSelectorModule } from 'src/app/components/common/model-interest-selector/model-interest-selector.module';
import { ModelInterestSelectorComponent } from 'src/app/components/common/model-interest-selector/model-interest-selector.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    TranslateModule,
    SelectorComponentModule,
    ItemErrComponentModule,
    OpportunityDetailsPageRoutingModule,
    ModelInterestSelectorModule,
  ],
  declarations: [OpportunityDetailsPage],
  entryComponents: [ModelInterestSelectorComponent],
})
export class OpportunityDetailsPageModule {}
