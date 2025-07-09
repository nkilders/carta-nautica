import { LayersService } from '../services/layers.service';
import { Layer } from '../models/layers';
import { XYZ } from 'ol/source';
import TileLayer from 'ol/layer/Tile';
import { SettingsService } from '../services/settings.service';
import { MapService } from '../services/map.service';
import { Map as OLMap } from 'ol';

export function createLayerManager(
  // Services
  layersService: LayersService,
  map: MapService | OLMap,
  settingsService: SettingsService,
) {
  if (map instanceof MapService) {
    map = map.getMap();
  }

  return new LayerManager(layersService, settingsService, map);
}

class LayerManager {
  private readonly layers: Map<string, TileLayer<any>>;

  constructor(
    // Services
    private readonly layersService: LayersService,
    private readonly settingsService: SettingsService,
    // Other
    private readonly map: OLMap,
  ) {
    this.layers = new Map();

    this.registerListeners();
    this.reloadAllLayers();
  }

  private registerListeners() {
    this.layersService.on('create', (id, layer) => this.onLayerCreated(layer));
    this.layersService.on('update', (id, layer) =>
      this.onLayerUpdated(id, layer),
    );
    this.layersService.on('delete', (id, layer) => this.onLayerDeleted(id));
    this.layersService.on('updateOrder', () => this.reloadAllLayers());
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

    this.map.removeLayer(tileLayer);
    this.layers.delete(layerId);
  }

  private async reloadAllLayers() {
    this.removeAllLayers();

    const allLayers = await this.layersService.getAll();

    allLayers.forEach((layer, i) => {
      this.addLayer(layer, i);
    });
  }

  private async addLayer(layer: Layer, zIndex: number) {
    const preload = await this.settingsService.getMapPreloading();
    const tileLayer = new TileLayer({
      source: new XYZ({
        url: layer.source,
      }),
      zIndex: -zIndex,
      visible: layer.visible,
      preload,
    });

    this.map.addLayer(tileLayer);
    this.layers.set(layer.id, tileLayer);
  }

  private removeAllLayers() {
    this.layers.forEach((layer) => {
      this.map.removeLayer(layer);
    });

    this.layers.clear();
  }
}
