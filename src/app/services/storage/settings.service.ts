import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

const SETTINGS_KEY = 'cn-maps';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private storage: Storage;

  constructor() {
    this.storage = new Storage();
    this.storage.create();
  }
}
