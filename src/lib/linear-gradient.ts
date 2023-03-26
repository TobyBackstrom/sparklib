/**
 * Interface representing a single color stop in a gradient.
 */
interface ColorStop {
  /** The position of the color stop along the gradient line, ranging from 0 to 1. */
  offset: number;
  /** The color of the color stop, expressed as a CSS color string. */
  color: string;
}

export type LinearGradientValueType = 'domain' | 'canvas';

/**
 * Class representing a linear gradient.
 */
export class LinearGradient {
  private colorStops: ColorStop[] = [];

  /**
   * Create a new LinearGradient instance.
   * @param x0 The x-coordinate of the gradient line's start point.
   * @param y0 The y-coordinate of the gradient line's start point.
   * @param x1 The x-coordinate of the gradient line's end point.
   * @param y1 The y-coordinate of the gradient line's end point.
   */
  constructor(
    private x0: number,
    private y0: number,
    private x1: number,
    private y1: number,
    private valueType: LinearGradientValueType = 'canvas'
  ) {}

  /**
   * Add a color stop to the linear gradient.
   * @param offset The position of the color stop along the gradient line, ranging from 0 to 1.
   * @param color The color of the color stop, expressed as a CSS color string.
   * @returns The LinearGradient instance, for method chaining.
   */
  addColorStop(offset: number, color: string) {
    this.colorStops.push({ offset, color });
    return this;
  }

  /**
   * Get a CanvasGradient object representing the linear gradient, for use with the HTML canvas API.
   * @param context The 2D rendering context of the canvas.
   * @returns A CanvasGradient object representing the linear gradient.
   */
  getCanvasGradient(context: CanvasRenderingContext2D): CanvasGradient {
    const gradient = context.createLinearGradient(
      this.x0,
      this.y0,
      this.x1,
      this.y1
    );

    this.colorStops.forEach((s) => gradient.addColorStop(s.offset, s.color));

    return gradient;
  }
}

/**
 * Create a new LinearGradient instance.
 * @param x0 The x-coordinate of the gradient line's start point.
 * @param y0 The y-coordinate of the gradient line's start point.
 * @param x1 The x-coordinate of the gradient line's end point.
 * @param y1 The y-coordinate of the gradient line's end point.
 * @returns A new LinearGradient instance.
 */
export const linearGradient = (
  x0: number,
  y0: number,
  x1: number,
  y1: number
) => {
  return new LinearGradient(x0, y0, x1, y1);
};