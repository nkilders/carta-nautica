import { Injectable } from '@angular/core';
import { Response, WebServer } from '@ionic-native/web-server/ngx';
import { SQLite } from '@ionic-native/sqlite/ngx';

import { Map } from '../stuff/map';
import { MapStorageService } from './storage/map.service';

@Injectable({
  providedIn: 'root'
})
export class OfflineMapService {
  private maps: Map[] = [];

  constructor(
    private webServer: WebServer,
    private mapService: MapStorageService,
    private sqlite: SQLite
  ) {
    this.reloadMaps();

    // http://localhost:12345/{UUID}/{z}/{x}/{y}
    
    webServer.onRequest().subscribe(req => {
      console.log('Path: ' + req.path);

      let args = req.path.split('/');
      if(args.length == 4) {
        console.log('UUID: ' + args[0]);
        console.log('Zoom: ' + args[1]);
        console.log('X: ' + args[2]);
        console.log('Y: ' + args[3]);

        // TODO: Bild aus SQLite laden und zurückgeben
      }
      
      const res: Response = {
        status: 200,
        body: 'Moin',
        headers: {
          'Content-Type': 'text/plain'
        }
      };

      webServer.sendResponse(req.requestId, res).catch(err => console.log(err));
    });

    webServer.start(12345).catch(err => console.log(err));
  }

  public reloadMaps() {
    this.mapService.getMaps().then(maps => {
      this.maps = [];

      for(let map of maps) {
        if(map.type === 'offline') {
          this.maps.push(map);
        }
      }
    })
  }
}