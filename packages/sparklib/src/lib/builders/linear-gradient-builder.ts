import { ColorStop, LinearGradient } from '../models';

/**
 * A builder class for creating `LinearGradient` objects.
 *
 * @public
 *
 * @example
 * ```typescript
 * const builder = new LinearGradientBuilder(0, 0, 100, 0);
 * const gradient = builder
 *   .addColorStop(0, 'red')
 *   .addColorStop(1, 'blue')
 *   .build();
 * ```
 */
export class LinearGradientBuilder {
  private colorStops: ColorStop[];

  /**
   * Creates a new instance of the `LinearGradientBuilder` class.
   *
   * @param x0 - The x-coordinate of the gradient line's start point.
   * @param y0 - The y-coordinate of the gradient line's start point.
   * @param x1 - The x-coordinate of the gradient line's end point.
   * @param y1 - The y-coordinate of the gradient line's end point.
   * @param colorStops - An optional initial array of `ColorStop` objects.
   */
  constructor(
    private x0: number,
    private y0: number,
    private x1: number,
    private y1: number,
    colorStops?: ColorStop[],
  ) {
    this.colorStops = colorStops ?? [];
  }

  /**
   * Adds a new color stop to the gradient.
   *
   * @param offset - The position of the color stop along the gradient line, ranging from 0 to 1.
   * @param color - The color of the color stop, expressed as a CSS color string.
   * @returns The `LinearGradientBuilder` instance, for chaining.
   */
  addColorStop(offset: number, color: string): LinearGradientBuilder {
    this.colorStops.push({ offset, color });
    return this;
  }

  /**
   * Builds the `LinearGradient` object based on the current state of the builder.
   *
   * @returns A `LinearGradient` object.
   */
  build(): LinearGradient {
    return {
      x0: this.x0,
      y0: this.y0,
      x1: this.x1,
      y1: this.y1,
      colorStops: this.colorStops,
    };
  }
}

/**
 * Convenience function for creating a `LinearGradientBuilder` instance.
 *
 * @param x0 - The x-coordinate of the gradient line's start point.
 * @param y0 - The y-coordinate of the gradient line's start point.
 * @param x1 - The x-coordinate of the gradient line's end point.
 * @param y1 - The y-coordinate of the gradient line's end point.
 * @param colorStops - An optional initial array of `ColorStop` objects.
 * @returns A new `LinearGradientBuilder` instance.
 *
 * @example
 * ```typescript
 * const gradient = linearGradient(0, 0, 100, 0)
 *   .addColorStop(0, 'red')
 *   .addColorStop(1, 'blue')
 *   .build();
 * ```
 */
export const linearGradient = (
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  colorStops?: ColorStop[],
) => {
  return new LinearGradientBuilder(x0, y0, x1, y1, colorStops);
};
