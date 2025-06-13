import { LayersService } from '../services/layers.service';
import { Layer } from '../models/layers';
import { XYZ } from 'ol/source';
import TileLayer from 'ol/layer/Tile';
import { SettingsService } from '../services/settings.service';
import { MapService } from '../services/map.service';

export function createLayerManager(
  mapSrv: MapService,
  layersSrv: LayersService,
  settings: SettingsService,
) {
  return new LayerManager(mapSrv, layersSrv, settings);
}

class LayerManager {
  private readonly layers: Map<string, TileLayer<any>>;

  constructor(
    private readonly mapSrv: MapService,
    private readonly layersSrv: LayersService,
    private readonly settings: SettingsService,
  ) {
    this.layers = new Map();

    this.registerListeners();
    this.reloadAllLayers();
  }

  private registerListeners() {
    this.layersSrv.on('create', (id, layer) => this.onLayerCreated(layer));
    this.layersSrv.on('update', (id, layer) => this.onLayerUpdated(id, layer));
    this.layersSrv.on('delete', (id, layer) => this.onLayerDeleted(id));
    this.layersSrv.on('updateOrder', () => this.reloadAllLayers());
  }

  private async onLayerCreated(layer: Layer) {
    const index = this.layers.size;
    await this.addLayer(layer, index);
  }

  private onLayerUpdated(layerId: string, layer: Layer) {
    const tileLayer = this.layers.get(layerId);
    if (!tileLayer) {
      return;
    }

    tileLayer.setSource(
      new XYZ({
        url: layer.source,
      }),
    );

    tileLayer.setVisible(layer.visible);
  }

  private onLayerDeleted(layerId: string) {
    const tileLayer = this.layers.get(layerId);
    if (!tileLayer) {
      return;
    }

    this.mapSrv.getMap().removeLayer(tileLayer);
    this.layers.delete(layerId);
  }

  private async reloadAllLayers() {
    this.removeAllLayers();

    const allLayers = await this.layersSrv.getAll();

    allLayers.forEach((layer, i) => {
      this.addLayer(layer, i);
    });
  }

  private async addLayer(layer: Layer, zIndex: number) {
    const preload = await this.settings.getMapPreloading();
    const tileLayer = new TileLayer({
      source: new XYZ({
        url: layer.source,
      }),
      zIndex: -zIndex,
      visible: layer.visible,
      preload,
    });

    this.mapSrv.getMap().addLayer(tileLayer);
    this.layers.set(layer.id, tileLayer);
  }

  private removeAllLayers() {
    this.layers.forEach((layer) => {
      this.mapSrv.getMap().removeLayer(layer);
    });

    this.layers.clear();
  }
}
