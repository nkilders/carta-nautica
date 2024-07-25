import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private storage?: Storage;

  constructor(private storageApi: Storage) {}

  public async set(key: string, value: any) {
    await this.init();

    await this.storage?.set(key, value);
  }

  public async get(key: string) {
    await this.init();

    return await this.storage?.get(key);
  }

  public async remove(key: string) {
    await this.init();

    await this.storage?.remove(key);
  }

  public async clear() {
    await this.init();

    await this.storage?.clear();
  }

  private async init() {
    if (this.storage) {
      return;
    }

    this.storage = await this.storageApi.create();
  }
}
