import { Component, OnInit } from '@angular/core';
import { FileChooser } from '@ionic-native/file-chooser/ngx'
import { AlertController, ToastController } from '@ionic/angular';

import { MapService } from 'src/app/services/map.service';
import { Map } from 'src/app/stuff/map';

@Component({
  selector: 'app-map-manager',
  templateUrl: './map-manager.page.html',
  styleUrls: ['./map-manager.page.scss'],
})
export class MapManagerPage implements OnInit {
  private mapsOnline: Map[] = [];
  private mapsOffline: Map[] = [];

  constructor(
    private mapService: MapService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.loadMaps();
  }

  private loadMaps() {
    this.mapService.getMaps().then(maps => {
      if(maps === null) return;

      this.mapsOnline = [];
      this.mapsOffline = [];

      for(let m of maps) {
        if(m.type === 'online') {
          this.mapsOnline.push(m);
        } else if(m.type === 'offline') {
          this.mapsOffline.push(m);
        }
      }
    });
  }

  show(tabName) {
    let tabs = document.getElementsByClassName('tabs');
    
    for(let t = 0; t < tabs.length; t++) {
      let tab = tabs.item(t);

      if(tab.classList.contains(tabName)) {
        tab.removeAttribute('hidden');
      } else {
        tab.setAttribute('hidden', '');
      }
    }
  }

  fabAddOnline() {
    this.alertCtrl.create({
      header: 'Add Map',
      subHeader: 'Online',
      animated: true,
      backdropDismiss: false,
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Name'
        },
        {
          name: 'url',
          type: 'url',
          placeholder: 'URL'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Add Map',
          role: 'add-map'
        }
      ]
    }).then(alert => {
      alert.present();

      alert.onDidDismiss().then(e => {
        if(e.role === 'add-map') {
          if(e.data.values.url === '') {
            this.toastCtrl.create({
              message: 'No URL entered',
              duration: 2000,
              animated: true,
              color: 'danger'
            }).then(t => t.present());
  
            return;
          }
  
          if(e.data.values.name === '') e.data.values.name = 'Map';
  
          let map = new Map('online', e.data.values.name, e.data.values.url);
          
          this.mapService.addMap(map).then(() => {
            this.loadMaps();
          });
        }
      });
    });
  }

  editOnlineMap(map) {
    console.log('editOnlineMap()');
  }

  editOfflineMap(map) {
    console.log('editOfflineMap()');
  }

  deleteMap(map) {
    this.mapService.deleteMap(map).then(() => {
      this.loadMaps();
    });
  }

  fabAddOffline() {
    new FileChooser().open(/* add filter? */).then(
      uri => {
        console.log(uri);
        
        // TODO: validate & load map
      }
    ).catch(console.log);
    
  }
}
