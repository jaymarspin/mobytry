import { Document } from '../models/common/document.model';
import { Observable } from 'rxjs';
import { SelectOption } from '../models/common/select-option.model';

export interface IDocumentsApi {
  getDocList(contactId: string): Observable<Document[]>;
  getDocTypes(): SelectOption[];
}
