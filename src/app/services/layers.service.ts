import { Injectable } from '@angular/core';
import { EventEmitter } from 'events';
import { StorageService } from './storage.service';
import { Layer, LayerWithoutId } from '../models/layers';
import { v4 as uuidv4 } from 'uuid';
import { arrayMove } from '../utils/array';

const STORAGE_KEY = 'layers';

@Injectable({
  providedIn: 'root',
})
export class LayersService {
  private readonly eventEmitter: EventEmitter;
  /**
   * The order of layers on the UI is equivalent to the order in this array.
   * Index 0 represents the topmost layer
   */
  private layers?: Layer[];

  constructor(private readonly storage: StorageService) {
    this.eventEmitter = new EventEmitter();
  }

  public async getAll() {
    if (!this.layers) {
      await this.init();
    }

    return this.layers!;
  }

  public async get(layerId: string) {
    if (!this.layers) {
      await this.init();
    }

    const layer = this.layers!.find((l) => l.id === layerId);

    return layer || null;
  }

  public async create(layer: LayerWithoutId) {
    if (!this.layers) {
      await this.init();
    }

    const newLayer: Layer = {
      id: uuidv4(),
      ...layer,
    };

    this.layers!.push(newLayer);

    this.eventEmitter.emit('create', newLayer.id, newLayer);

    await this.save();

    return newLayer;
  }

  public async moveLayer(layerId: string, newIndex: number) {
    if (!this.layers) {
      await this.init();
    }

    const layer = await this.get(layerId);
    if (!layer) {
      return;
    }

    const oldIndex = this.layers!.indexOf(layer);

    arrayMove(this.layers!, oldIndex, newIndex);

    this.eventEmitter.emit('updateOrder', this.layers!);

    await this.save();

    return this.layers!;
  }

  public async update(layerId: string, layer: LayerWithoutId) {
    if (!this.layers) {
      await this.init();
    }

    const oldLayer = await this.get(layerId);
    if (!oldLayer) {
      return;
    }

    const updatedLayer: Layer = { id: layerId, ...layer };

    this.layers = this.layers!.map((l) =>
      l.id === layerId ? updatedLayer : l,
    );

    this.eventEmitter.emit('update', layerId, updatedLayer);

    await this.save();

    return updatedLayer;
  }

  public async delete(layerId: string) {
    if (!this.layers) {
      await this.init();
    }

    const layer = await this.get(layerId);
    if (!layer) {
      return;
    }

    this.layers = this.layers!.filter((l) => l.id !== layerId);

    this.eventEmitter.emit('delete', layerId, layer);

    await this.save();
  }

  on(
    event: 'create' | 'update' | 'delete',
    listener: (id: string, layer: Layer) => void,
  ): void;
  on(event: 'updateOrder', listener: (layers: Layer[]) => void): void;

  public on(event: string, listener: (...args: any) => void) {
    this.eventEmitter.on(event, listener);
  }

  private async init() {
    if (this.layers) {
      return;
    }

    this.layers = await this.storage.get(STORAGE_KEY);

    if (!this.layers) {
      this.layers = this.defaultLayers();
      await this.save();
    }
  }

  private defaultLayers() {
    return [
      {
        id: uuidv4(),
        name: 'OpenSeaMap',
        source: 'https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png',
        visible: true,
      },
      {
        id: uuidv4(),
        name: 'OpenStreetMap DE',
        source: 'https://a.tile.openstreetmap.de/{z}/{x}/{y}.png',
        visible: true,
      },
      {
        id: uuidv4(),
        name: 'OpenStreetMap EN',
        source: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        visible: false,
      },
    ] as Layer[];
  }

  private async save() {
    await this.storage.set(STORAGE_KEY, this.layers);
  }
}
