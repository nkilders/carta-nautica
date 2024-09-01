import { MapBrowserEvent } from 'ol';
import { SeamarkFeature } from '../models/seamark';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { ZIndex } from './z-indices';
import { MapService } from '../services/map.service';
import { FeatureLike } from 'ol/Feature';
import { geoDistance } from './coordinates';

const RELOAD_DISTANCE_KM = 5;

export class SeamarkLayerManager {
  private layer?: VectorLayer;
  private layerSource?: VectorSource;

  private objects: number[] = [];
  private lastLongitude = 0;
  private lastLatitude = 0;

  constructor(private mapSrv: MapService) {
    this.createLayer();
    this.registerListeners();

    mapSrv.getMap().on('moveend', (e) => {
      const zoom = e.map.getView().getZoom() ?? 0;
      const tooFarAway = zoom < 12;

      this.layer?.setVisible(!tooFarAway);

      if (tooFarAway) {
        return;
      }

      const [longitude, latitude] = e.map.getView().getCenter()!;

      const distKm = geoDistance(
        latitude,
        longitude,
        this.lastLatitude,
        this.lastLongitude,
      );

      if (distKm > RELOAD_DISTANCE_KM) {
        this.lastLatitude = latitude;
        this.lastLongitude = longitude;

        this.loadFeatures(longitude, latitude);
      }
    });
  }

  private async loadFeatures(longitude: number, latitude: number) {
    const radiusMeters = 20_000;
    const url = `https://overpass-api.de/api/interpreter?data=[out:json];(node["seamark:type"~".*"](around:${radiusMeters},${latitude},${longitude}););out%20body;`;

    const response = await fetch(url);

    const json = await response.json();

    // this.layerSource?.clear();

    console.log('#### fetched', json.elements.length, 'new objects');

    json.elements
      .filter((e: any) => !this.objects.includes(e.id))
      .forEach((e: any) => {
        this.objects.push(e.id);
        this.layerSource?.addFeature(
          new SeamarkFeature({
            id: e.id,
            longitude: e.lon,
            latitude: e.lat,
            tags: e.tags,
          }),
        );
      });
  }

  private createLayer() {
    this.layerSource = new VectorSource();

    this.layer = new VectorLayer({
      source: this.layerSource,
      zIndex: ZIndex.SEAMARKS,
    });

    this.mapSrv.getMap().addLayer(this.layer);
  }

  private registerListeners() {
    this.mapSrv.on('featureClicked', async (feature) => {
      await this.onMapClick(feature);
    });
  }

  private async onMapClick(feature: FeatureLike) {
    if (feature instanceof SeamarkFeature) {
      console.log('####', JSON.stringify(feature.getSeamark(), null, '  '));
      const zoom = this.mapSrv.getMap().getView().getZoom();
      console.log('#### Zoom', zoom);
      console.log('#### Objects', this.objects.length);
    }
  }
}
