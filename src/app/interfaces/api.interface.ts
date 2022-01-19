import { Observable } from 'rxjs';
import { Header } from './header.interface';

export interface IAPI {
  getAPIUrl(url): string;
  getHttpOptions(type: string): Observable<Header>;
}
