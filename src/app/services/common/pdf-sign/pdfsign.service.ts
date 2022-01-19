import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PDFSignService {
  private static URL = environment.production
    ? 'https://5aux97ygl0.execute-api.ap-southeast-1.amazonaws.com/prod/sign'
    : 'https://5aux97ygl0.execute-api.ap-southeast-1.amazonaws.com/dev/sign';

  constructor(private http: HttpClient) {}

  signPDF(xPos: number, yPos: number, page: number, width: number, height: number, pdf: Blob, sig: Blob): Observable<Blob> {
    const multiFormData = new FormData();
    multiFormData.append('x', xPos.toString());
    multiFormData.append('y', yPos.toString());
    multiFormData.append('page', page.toString());
    multiFormData.append('width', width.toString());
    multiFormData.append('height', height.toString());
    multiFormData.append('pdf', pdf);
    multiFormData.append('sig', sig);
    return this.http.post(PDFSignService.URL, multiFormData, {
      headers: new HttpHeaders({
        Accept: 'application/pdf',
        'Content-Type': 'multipart/form-data',
        'x-api-key': 'gWKO3dV2dK7PMeenChQc8381iA7a5W5r6xhFCXxa',
      }),
      responseType: 'blob',
    });
  }
}
