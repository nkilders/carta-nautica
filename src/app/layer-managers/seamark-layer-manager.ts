import { MapEvent } from 'ol';
import { SeamarkFeature } from '../models/seamark';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { ZIndex } from '../utils/z-indices';
import { MapService } from '../services/map.service';
import { FeatureLike } from 'ol/Feature';
import { geoDistance } from '../utils/coordinates';
import { OverpassResponse } from '../models/overpass';
import { ModalWrapper } from '../wrappers/modal-wrapper';
import { SeamarkViewPage } from '../pages/seamark-view/seamark-view.page';

const RELOAD_DISTANCE_KM = 5;

export function createSeamarkLayerManager(
  // Controllers
  modalController: ModalWrapper,
  // Services
  mapService: MapService,
) {
  return new SeamarkLayerManager(modalController, mapService);
}

class SeamarkLayerManager {
  private readonly layerSource: VectorSource;
  private readonly layer: VectorLayer;
  private readonly objects: number[] = [];

  private lastLongitude = 0;
  private lastLatitude = 0;

  constructor(
    // Controllers
    private readonly modalController: ModalWrapper,
    // Services
    private readonly mapService: MapService,
  ) {
    this.layerSource = new VectorSource();
    this.layer = this.createLayer(this.layerSource);

    this.registerListeners();
  }

  private createLayer(source: VectorSource) {
    const layer = new VectorLayer({
      source,
      zIndex: ZIndex.SEAMARKS,
    });

    this.mapService.getMap().addLayer(layer);

    return layer;
  }

  private registerListeners() {
    this.mapService.on('featureClicked', (feature) => {
      this.onMapClick(feature);
    });

    this.mapService.getMap().on('moveend', (event) => {
      this.onMapMoveEnd(event);
    });
  }

  private async onMapClick(feature: FeatureLike) {
    if (feature instanceof SeamarkFeature) {
      console.log('####', JSON.stringify(feature.getSeamark(), null, '  '));
      const zoom = this.mapService.getMap().getView().getZoom();
      console.log('#### Zoom', zoom);
      console.log('#### Objects', this.objects.length);

      const modal = await this.modalController.create({
        component: SeamarkViewPage,
        componentProps: {
          seamark: feature.getSeamark(),
        },
      });

      await modal.present();
    }
  }

  private onMapMoveEnd(event: MapEvent) {
    const zoom = event.map.getView().getZoom() ?? 0;
    const tooFarAway = zoom < 12;

    this.layer.setVisible(!tooFarAway);

    if (tooFarAway) {
      return;
    }

    const [longitude, latitude] = event.map.getView().getCenter()!;

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
  }

  private async loadFeatures(longitude: number, latitude: number) {
    const radiusMeters = 20_000;
    const url = `https://overpass-api.de/api/interpreter?data=[out:json][timeout:25];(node["seamark:light:colour"](around:${radiusMeters},${latitude},${longitude});node["seamark:light:1:colour"](around:${radiusMeters},${latitude},${longitude}););out;`;

    const response = await fetch(url);
    const json: OverpassResponse = await response.json();

    json.elements
      .filter((e) => !this.objects.includes(e.id))
      .forEach((e) => {
        this.objects.push(e.id);
        this.layerSource.addFeature(
          new SeamarkFeature({
            id: e.id,
            longitude: e.lon,
            latitude: e.lat,
            tags: e.tags,
          }),
        );
      });
  }
}
