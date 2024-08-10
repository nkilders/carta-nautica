import { Coordinate } from 'ol/coordinate';
import { MapService } from '../services/map.service';

const CLICK_DURATION_MS = 500;
const MAX_DISTANCE_FROM_START_BEFORE_CANCEL = 10;

type Listener = (coord: Coordinate) => void;

export class LongClick {
  private readonly listener: Listener;

  private startX: number = 0;
  private startY: number = 0;
  private timeout?: NodeJS.Timeout;

  constructor(
    private mapSrv: MapService,
    listener: Listener,
  ) {
    this.listener = listener;

    this.registerListeners();
  }

  private registerListeners() {
    this.mapSrv
      .getMap()
      .getTargetElement()
      .addEventListener('touchstart', (event) => {
        if (event.touches.length > 1) {
          return;
        }

        const { clientX, clientY } = event.touches[0];

        this.startClick(clientX, clientY);
      });

    this.mapSrv
      .getMap()
      .getTargetElement()
      .addEventListener('mousedown', (event) => {
        const { layerX, layerY } = event;

        this.startClick(layerX, layerY);
      });

    this.mapSrv
      .getMap()
      .getTargetElement()
      .addEventListener('touchend', () => {
        this.clearTimeout();
      });

    this.mapSrv
      .getMap()
      .getTargetElement()
      .addEventListener('mouseup', () => {
        this.clearTimeout();
      });

    this.mapSrv.getMap().on('pointerdrag', (e) => {
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

    const coord = this.mapSrv.getMap().getCoordinateFromPixel([x, y]);

    this.timeout = setTimeout(() => this.listener(coord), CLICK_DURATION_MS);
  }

  private tooFarFromStartPos(x: number, y: number) {
    const distance = Math.abs(x - this.startX) + Math.abs(y - this.startY);

    return distance > MAX_DISTANCE_FROM_START_BEFORE_CANCEL;
  }

  private clearTimeout() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      delete this.timeout;
    }
  }
}
