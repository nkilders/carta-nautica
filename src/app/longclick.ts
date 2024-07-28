import { Map as OLMap } from 'ol';
import { Coordinate } from 'ol/coordinate';

const CLICK_DURATION_MS = 500;

type Listener = (coord: Coordinate) => void;

export class LongClick {
  private readonly listener: Listener;
  private timeout?: NodeJS.Timeout;

  constructor(map: OLMap, listener: Listener) {
    this.listener = listener;

    this.registerListeners(map);
  }

  private registerListeners(map: OLMap) {
    map.getTargetElement().addEventListener('mousedown', (event) => {
      const { layerX, layerY } = event;

      const coord = map.getCoordinateFromPixel([layerX, layerY]);

      this.timeout = setTimeout(() => this.listener(coord), CLICK_DURATION_MS);
    });

    map.getTargetElement().addEventListener('mouseup', () => {
      this.clearTimeout();
    });

    map.on('pointerdrag', () => {
      this.clearTimeout();
    });
  }

  private clearTimeout() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      delete this.timeout;
    }
  }
}
