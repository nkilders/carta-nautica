import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private storage: Storage | null = null;

  constructor(
    private storageApi: Storage
  ) {
    this.init();
  }

  async set(key: string, value: any) {
    console.log(this.storage);
    
    await this.storage?.set(key, value);
  }

  async get(key: string) {
    return this.storage?.get(key);
  }

  async has(key: string) {
    return !!(await this.get(key));
  }

  async remove(key: string) {
    this.storage?.remove(key);
  }

  async clear() {
    await this.storage?.clear();
  }

  private async init() {
    this.storage = await this.storageApi.create();
  }
}