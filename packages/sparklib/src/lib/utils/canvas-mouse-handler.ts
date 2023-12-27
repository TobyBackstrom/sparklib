import { MouseEventType } from '../models';
import { ChartMouseEvent } from '../models/chart-mouse-event';
import { getIndicesForPixelX } from './get-indices-for-pixel-x';

export type ChartMouseEventListener = (
  event: MouseEvent,
  chartMouseEvent?: ChartMouseEvent,
) => void;

export class CanvasMouseHandler {
  #canvas: HTMLCanvasElement;
  #eventListeners: Map<MouseEventType, (event: MouseEvent) => void>;
  #valueLength = 0;

  constructor(canvas: HTMLCanvasElement, valueLength: number) {
    this.#canvas = canvas;
    this.#eventListeners = new Map();
    this.#valueLength = valueLength;
  }

  public addEventListener(
    eventType: MouseEventType,
    userListener: ChartMouseEventListener,
  ): void {
    const wrappedListener = (event: MouseEvent) => {
      userListener(event, this.#getChartMouseEvent(event));
    };

    if (this.#eventListeners.has(eventType)) {
      console.warn(
        `Event listener for ${eventType} already exists. Replacing it.`,
      );
      this.removeEventListener(eventType);
    }

    this.#canvas.addEventListener(eventType, wrappedListener);
    this.#eventListeners.set(eventType, wrappedListener);
  }

  public removeEventListener(eventType: MouseEventType): void {
    const handler = this.#eventListeners.get(eventType);
    if (handler) {
      this.#canvas.removeEventListener(eventType, handler);
      this.#eventListeners.delete(eventType);
    }
  }

  public dispose() {
    this.#eventListeners.forEach((handler, eventType) => {
      this.#canvas.removeEventListener(eventType, handler);
    });
    this.#eventListeners.clear();
  }

  #getChartMouseEvent(event: MouseEvent): ChartMouseEvent | undefined {
    // TODO: investigate why sometimes event.offsetX == -1 and x < 0.
    // TODO: automatically handle when the app is reloaded and the user has zoomed the browser viewport which means the dpi has changed
    // TODO: automatically handle when the canvas is moved to a display with a different dpi
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
}
