/**
 * Represents the coordinate on the chart canvas and the corresponding indices in the rendered data array.
 */

export class ChartMouseEvent {
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

  constructor(x: number, y: number, startIndex: number, endIndex: number) {
    this.x = x;
    this.y = y;
    this.startIndex = startIndex;
    this.endIndex = endIndex;
  }
}
