import {
  ChartMouseEvent,
  ChartMouseEventListener,
  MouseEventType,
} from '../models';
import { getIndicesForPixelX } from './get-indices-for-pixel-x';

export class CanvasMouseHandler {
  #canvas?: HTMLCanvasElement;
  #eventListeners: Map<MouseEventType, (event: MouseEvent) => void>;
  #valueLength = 0;

  constructor() {
    this.#eventListeners = new Map();
  }

  setCanvas(canvas: HTMLCanvasElement): CanvasMouseHandler {
    this.#switchCanvas(this.#canvas, canvas);

    return this;
  }

  setValueLength(valueLength: number): CanvasMouseHandler {
    this.#valueLength = valueLength;
    return this;
  }

  public addEventListener(
    eventType: MouseEventType | MouseEventType[],
    userListener: ChartMouseEventListener,
  ): void {
    const types: MouseEventType[] = Array.isArray(eventType)
      ? eventType
      : [eventType];

    types.forEach((type) => {
      const wrappedListener = (event: MouseEvent) => {
        userListener(type, event, this.#getChartMouseEvent(event));
      };

      if (this.#eventListeners.has(type)) {
        console.warn(
          `Event listener for ${eventType} already exists. Replacing it.`,
        );
        this.removeEventListener(type);
      }

      if (this.#canvas) {
        this.#canvas.addEventListener(type, wrappedListener);
      }
      this.#eventListeners.set(type, wrappedListener);
    });
  }

  public removeEventListener(
    eventType: MouseEventType | MouseEventType[],
  ): void {
    const types: MouseEventType[] = Array.isArray(eventType)
      ? eventType
      : [eventType];

    types.forEach((type) => {
      const handler = this.#eventListeners.get(type);
      if (handler) {
        if (this.#canvas) {
          this.#canvas.removeEventListener(type, handler);
        }
        this.#eventListeners.delete(type);
      }
    });
  }

  public dispose() {
    if (this.#canvas) {
      this.#eventListeners.forEach((handler, eventType) => {
        this.#canvas?.removeEventListener(eventType, handler);
      });
    }
    this.#eventListeners.clear();
  }

  #switchCanvas(
    fromCanvas: HTMLCanvasElement | undefined,
    toCanvas: HTMLCanvasElement,
  ) {
    for (const [eventType, wrappedListener] of this.#eventListeners) {
      fromCanvas?.removeEventListener(eventType, wrappedListener);
      toCanvas.addEventListener(eventType, wrappedListener);
    }

    this.#canvas = toCanvas;
  }

  #getChartMouseEvent(event: MouseEvent): ChartMouseEvent | undefined {
    // TODO: investigate why sometimes event.offsetX == -1 and x < 0.
    // TODO: automatically handle when the app is reloaded and the user has zoomed the browser viewport which means the dpi has changed
    // TODO: automatically handle when the canvas is moved to a display with a different dpi
    if (this.#canvas) {
      const rect = this.#canvas.getBoundingClientRect();

      let x = event.clientX - rect.left;
      let y = event.clientY - rect.top;

      // Adjust if out of bounds
      x = Math.max(0, Math.min(x, this.#canvas.width - 1));
      y = Math.max(0, Math.min(y, this.#canvas.height - 1));

      const indices = getIndicesForPixelX(
        x,
        this.#canvas.width,
        this.#valueLength,
      );

      indices.endIndex =
        indices.endIndex < this.#valueLength
          ? indices.endIndex
          : this.#valueLength - 1;

      return new ChartMouseEvent(x, y, indices.startIndex, indices.endIndex);
    }

    return undefined;
  }
}
