import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewTestdrivePageRoutingModule } from './view-testdrive-routing.module';

import { ViewTestdrivePage } from './view-testdrive.page';
import { TranslateModule } from '@ngx-translate/core';
import { ScanTestdriveComponent } from './scan-testdrive/scan-testdrive.component';
import { ItemErrComponentModule } from 'src/app/components/common/item-err/item-err.module';
import { TestDriveIndemnityComponent } from 'src/app/components/common/test-drive-indemnity/test-drive-indemnity.component';
import { TestDriveIndemnityComponentModule } from 'src/app/components/common/test-drive-indemnity/test-drive-indemnity.module';
import { KeyScannerComponentModule } from 'src/app/components/common/key-scanner/key-scanner.module';
import { KeyScannerComponent } from 'src/app/components/common/key-scanner/key-scanner.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    IonicModule,
    TranslateModule,
    ViewTestdrivePageRoutingModule,
    ItemErrComponentModule,
    TestDriveIndemnityComponentModule,
    KeyScannerComponentModule,
  ],
  declarations: [ViewTestdrivePage, ScanTestdriveComponent],
  entryComponents: [TestDriveIndemnityComponent, KeyScannerComponent],
})
export class ViewTestdrivePageModule {}
