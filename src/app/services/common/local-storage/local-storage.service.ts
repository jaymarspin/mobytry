import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor(private storage: Storage) {}

  set(key: string, value: any) {
    return from(this.storage?.set(key, value));
  }

  get(key: string) {
    return from(this.storage?.get(key));
  }

  remove(key: string) {
    return from(this.storage?.remove(key));
  }

  clear() {
    return from(this.storage?.clear());
  }

  keys() {
    return from(this.storage?.keys());
  }
}
