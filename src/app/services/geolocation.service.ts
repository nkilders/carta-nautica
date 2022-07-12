import { Injectable } from '@angular/core';
import { Geolocation, GeolocationOptions, Geoposition } from '@ionic-native/geolocation/ngx';

const GEO_OPTIONS: GeolocationOptions = {
  enableHighAccuracy: true,
  maximumAge: 5000,
};

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  constructor(
    private geolocation: Geolocation,
  ) { }

  async getPosition() {
    return this.geolocation.getCurrentPosition(GEO_OPTIONS);
  }

  async watchPosition() {
    return this.geolocation.watchPosition(GEO_OPTIONS);
  }

  static isPosition(pos: any): pos is Geoposition {
    return 'coords' in pos && 'timestamp' in pos;
  }
}