/**
 * Represents the coordinate on the chart canvas and the corresponding indices in the rendered data array.
 */

import { MouseEventType } from './mouse-event-type';

export class ChartMouseEvent {
  /**
   * The type of event.
   */
  public readonly eventType: MouseEventType;

  /**
   * The X coordinate on the chart canvas.
   */
  public readonly x: number;

  /**
   * The Y coordinate on the chart canvas.
   */
  public readonly y: number;

  /**
   * The starting index of the data array that corresponds to the (x,y) coordinate.
   */
  public readonly startIndex: number;

  /**
   * The ending index of the data array that corresponds to the (x,y) coordinate.
   */
  public readonly endIndex: number;

  /**
   * The original mouse event.
   */
  public readonly mouseEvent: MouseEvent;

  constructor(
    eventType: MouseEventType,
    mouseEvent: MouseEvent,
    x: number,
    y: number,
    startIndex: number,
    endIndex: number,
  ) {
    this.eventType = eventType;
    this.mouseEvent = mouseEvent;
    this.x = x;
    this.y = y;
    this.startIndex = startIndex;
    this.endIndex = endIndex;
  }
}
