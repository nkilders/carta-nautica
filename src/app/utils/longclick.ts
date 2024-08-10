import { Coordinate } from 'ol/coordinate';
import { Map as OLMap } from 'ol';

const CLICK_DURATION_MS = 500;
const MAX_DISTANCE_FROM_START_BEFORE_CANCEL = 10;

type Listener = (coord: Coordinate) => void;

export class LongClick {
  private startX: number = 0;
  private startY: number = 0;
  private timeout?: NodeJS.Timeout;

  constructor(
    private map: OLMap,
    private listener: Listener,
  ) {
    this.registerListeners();
  }

  private registerListeners() {
    const targetElement = this.map.getTargetElement();

    targetElement.addEventListener('touchstart', (event) => {
      if (event.touches.length > 1) {
        return;
      }

      const { clientX, clientY } = event.touches[0];

      this.startClick(clientX, clientY);
    });

    targetElement.addEventListener('mousedown', (event) => {
      const { layerX, layerY } = event;

      this.startClick(layerX, layerY);
    });

    targetElement.addEventListener('touchend', () => {
      this.clearTimeout();
    });

    targetElement.addEventListener('mouseup', () => {
      this.clearTimeout();
    });

    this.map.on('pointerdrag', (event) => {
      if (!this.timeout) {
        return;
      }

      const { layerX, layerY } = event.originalEvent;

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

    return distance > MAX_DISTANCE_FROM_START_BEFORE_CANCEL;
  }

  private clearTimeout() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      delete this.timeout;
    }
  }
}
