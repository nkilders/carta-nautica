import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private storage: Storage | null = null;

  constructor(
    private storageApi: Storage
  ) { }

  async set(key: string, value: any) {
    await this.init();
    
    await this.storage.set(key, value);
  }

  async get(key: string) {
    await this.init();
    
    return this.storage.get(key);
  }

  async has(key: string) {
    await this.init();
    
    return !!(await this.get(key));
  }

  async remove(key: string) {
    await this.init();
    
    await this.storage.remove(key);
  }

  async clear() {
    await this.init();

    await this.storage.clear();
  }

  private async init() {
    if(this.storage) return;

    this.storage = await this.storageApi.create();
  }
}