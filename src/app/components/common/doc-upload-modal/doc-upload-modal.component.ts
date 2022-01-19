import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CommonDocumentService } from 'src/app/services/common/document/document.service';

@Component({
  selector: 'app-doc-upload-modal',
  templateUrl: './doc-upload-modal.component.html',
  styleUrls: ['./doc-upload-modal.component.scss'],
})
export class DocUploadModalComponent implements OnInit {
  documentTypes = this.documentService.getDocTypes();

  constructor(private modalCtrl: ModalController, private documentService: CommonDocumentService) {}

  ngOnInit() {}

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
