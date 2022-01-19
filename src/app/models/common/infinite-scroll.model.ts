import { Observable } from 'rxjs';

export class InfiniteScrollModel<T> {
  constructor(public result: T, public next: Observable<InfiniteScrollModel<T>>, public totalCount?: number) {}
}
