import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Geolocation, GeolocationOptions, Geoposition, PositionError } from '@ionic-native/geolocation/ngx';

const GEO_OPTIONS: GeolocationOptions = {
  enableHighAccuracy: true,
  maximumAge: 5000,
};

@Injectable({
  providedIn: 'root'
})
export class GeoPositionService {
  
  constructor(
    private geolocation: Geolocation
  ) { }

  getPosition() {
    return this.geolocation.getCurrentPosition(GEO_OPTIONS);
  }

  watchPosition() {
    return this.geolocation.watchPosition(GEO_OPTIONS);
  }
}