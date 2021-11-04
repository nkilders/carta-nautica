import { Component, OnInit, ViewChild } from '@angular/core';
import { IonReorder, IonReorderGroup } from '@ionic/angular';
import { MapStorageService } from 'src/app/services/storage/map.service';
import { Map } from 'src/app/stuff/map';

@Component({
  selector: 'app-map-layers',
  templateUrl: './map-layers.page.html',
  styleUrls: ['./map-layers.page.scss'],
})
export class MapLayersPage implements OnInit {
  @ViewChild(IonReorderGroup) reorderGroup: IonReorderGroup;

  private maps: Map[] = [];
  
  constructor(
    private mapService: MapStorageService
  ) { }

  ngOnInit() {
    this.loadMaps();
  }

  onReorder(e: CustomEvent<any>) {
    // Update position in "maps" array
    this.arrayMove(this.maps, e.detail.from, e.detail.to);

    // Update position-attributes
    this.maps.forEach((map, index) => {
      map.position = index;
      this.mapService.updateMap(map);
    });

    e.detail.complete();
  }

  toggleMapStatus(e, index) {
    let map = this.maps[index];

    map.enabled = e.detail.checked;
    this.mapService.updateMap(map);
  }

  private arrayMove(arr, indexFrom, indexTo) {
    if (indexTo >= arr.length) {
      var k = indexTo - arr.length + 1;

      while (k--) {
        arr.push(undefined);
      }
    }

    arr.splice(indexTo, 0, arr.splice(indexFrom, 1)[0]);

    return arr;
  }

  private loadMaps() {
    this.mapService.getMaps().then(maps => {
      this.maps = maps.sort((m1, m2) => m1.position - m2.position);

      // Replace initial position "99999" with real position
      this.maps.forEach((map, index) => {
        map.position = index;
        this.mapService.updateMap(map);
      });
    });
  }

}