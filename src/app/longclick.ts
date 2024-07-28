import { Map as OLMap } from 'ol';
import { Coordinate } from 'ol/coordinate';

const CLICK_DURATION_MS = 500;

type Listener = (coord: Coordinate) => void;

export class LongClick {
  private readonly map: OLMap;
  private readonly listener: Listener;

  private startX: number = 0;
  private startY: number = 0;
  private timeout?: NodeJS.Timeout;

  constructor(map: OLMap, listener: Listener) {
    this.map = map;
    this.listener = listener;

    this.registerListeners();
  }

  private registerListeners() {
    this.map.getTargetElement().addEventListener('touchstart', (event) => {
      if (event.touches.length > 1) {
        return;
      }

      const { clientX, clientY } = event.touches[0];

      this.startClick(clientX, clientY);
    });

    this.map.getTargetElement().addEventListener('mousedown', (event) => {
      const { layerX, layerY } = event;

      this.startClick(layerX, layerY);
    });

    this.map.getTargetElement().addEventListener('touchend', () => {
      this.clearTimeout();
    });

    this.map.getTargetElement().addEventListener('mouseup', () => {
      this.clearTimeout();
    });

    this.map.on('pointerdrag', (e) => {
      if (!this.timeout) {
        return;
      }

      const { layerX, layerY } = e.originalEvent;

      if (this.tooFarFromStartPos(layerX, layerY)) {
        this.clearTimeout();
      }
    });
  }

  private startClick(x: number, y: number) {
    this.startX = x;
    this.startY = y;

    const coord = this.map.getCoordinateFromPixel([x, y]);

    this.timeout = setTimeout(() => this.listener(coord), CLICK_DURATION_MS);
  }

  private tooFarFromStartPos(x: number, y: number) {
    const distance = Math.abs(x - this.startX) + Math.abs(y - this.startY);

    return distance > 10;
  }

  private clearTimeout() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      delete this.timeout;
    }
  }
}
