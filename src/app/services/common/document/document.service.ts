import { Injectable, Inject } from '@angular/core';
import { IDocumentsApi } from 'src/app/interfaces/document-api.interface';
import { DOCUMENT_SERVICE_KEY } from 'src/app/service-providers/dynamic-key.provider';
import { Observable } from 'rxjs';
import { Document } from 'src/app/models/common/document.model';
import { ErrorService } from '../error/error.service';
import { SelectOption } from 'src/app/models/common/select-option.model';

@Injectable({
  providedIn: 'root',
})
export class CommonDocumentService implements IDocumentsApi {
  constructor(@Inject(DOCUMENT_SERVICE_KEY) private documentAPI: IDocumentsApi, private errorSrvc: ErrorService) {}

  getDocList(contactId: string): Observable<Document[]> {
    try {
      return this.documentAPI.getDocList(contactId);
    } catch (e) {
      this.errorSrvc.presentServerErr(e);
    }
  }

  getDocTypes(): SelectOption[] {
    return this.documentAPI.getDocTypes();
  }
}
