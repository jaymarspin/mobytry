import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Document } from 'src/app/models/common/document.model';
import { SelectOption } from 'src/app/models/common/select-option.model';

@Injectable({
  providedIn: 'root',
})
export class DocumentServiceSG {
  constructor() {}

  getDocList(contactId: string): Observable<Document[]> {
    const docId = [0, 1, 2];
    return of(
      docId.map((i) => {
        const doc = new Document();
        doc.Name = 'BMW 118i M Sport (F20)';
        doc.Id = '1';
        doc.Number = 'ABC 123456';
        doc.Type = 'RCO';
        doc.UploadedDate = '09/14/2011 11:09 AM';
        return doc;
      })
    );
  }

  getDocTypes(): SelectOption[] {
    return [
      {
        label: 'IC',
        value: 'IC',
      },
      {
        label: 'Passport',
        value: 'Passport',
      },
    ];
  }
}
