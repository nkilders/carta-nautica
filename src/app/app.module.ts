import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

// Providers
import { Insomnia } from '@ionic-native/insomnia/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx'
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { WebServer } from '@ionic-native/web-server/ngx';
import { SQLite } from '@ionic-native/sqlite/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MapLayersPageModule } from './map/modals/map-layers/map-layers.module';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, MapLayersPageModule],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Insomnia, Geolocation, WebServer, SQLite, LocalNotifications
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}