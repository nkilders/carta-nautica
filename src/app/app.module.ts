import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { IonicStorageModule } from '@ionic/storage-angular';

import { TrackLengthPipe } from './pipes/track-length.pipe';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Insomnia } from '@ionic-native/insomnia/ngx';
import { DeviceOrientation } from '@awesome-cordova-plugins/device-orientation/ngx';
import { NativeGeocoder } from '@awesome-cordova-plugins/native-geocoder/ngx';
import { AppVersion } from '@awesome-cordova-plugins/app-version/ngx';

@NgModule({
  declarations: [
    AppComponent,
    TrackLengthPipe,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    IonicStorageModule.forRoot({
      name: 'carta-nautica',
    }),
  ],
  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy,
    },
    Geolocation,
    Insomnia,
    DeviceOrientation,
    NativeGeocoder,
    AppVersion,
  ],
  bootstrap: [
    AppComponent,
  ],
})
export class AppModule {}
