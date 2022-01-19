import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TestDriveIndemnityComponent } from './test-drive-indemnity.component';
import { SignatureComponentModule } from '../signature/signature.module';

@NgModule({
  imports: [CommonModule, IonicModule, ReactiveFormsModule, FormsModule, SignatureComponentModule],
  declarations: [TestDriveIndemnityComponent],
  exports: [TestDriveIndemnityComponent],
})
export class TestDriveIndemnityComponentModule {}
