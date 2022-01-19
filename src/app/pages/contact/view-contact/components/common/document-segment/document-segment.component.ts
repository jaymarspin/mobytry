import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ModalController } from '@ionic/angular';
import { Document } from 'src/app/models/common/document.model';
import { from } from 'rxjs';
import { DocUploadModalComponent } from 'src/app/components/common/doc-upload-modal/doc-upload-modal.component';

@Component({
  selector: 'app-document-segment',
  templateUrl: './document-segment.component.html',
  styleUrls: ['./document-segment.component.scss'],
})
export class DocumentSegmentComponent implements OnInit {
  @Input() documents: Document[];

  constructor(private modalCtrl: ModalController, private translate: TranslateService) {}

  ngOnInit() {}

  uploadFile() {
    from(
      this.modalCtrl.create({
        component: DocUploadModalComponent,
        cssClass: 'document-upload-modal',
        backdropDismiss: true,
      })
    ).subscribe((modal) => {
      modal.present();
    });
  }
}
