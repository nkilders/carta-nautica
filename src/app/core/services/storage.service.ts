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
    if(!this.storage) await this.init();
    
    await this.storage.set(key, value);
  }

  async get(key: string) {
    if(!this.storage) await this.init();
    
    return this.storage.get(key);
  }

  async has(key: string) {
    if(!this.storage) await this.init();
    
    return !!(await this.get(key));
  }

  async remove(key: string) {
    if(!this.storage) await this.init();
    
    await this.storage.remove(key);
  }

  async clear() {
    if(!this.storage) await this.init();

    await this.storage.clear();
  }

  private async init() {
    this.storage = await this.storageApi.create();
  }
}