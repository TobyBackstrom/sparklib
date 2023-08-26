import { ColorStop } from './color-stop';

/**
 * Represents a linear gradient.
 *
 * @remarks
 * A linear gradient defines color transitions along a line.
 * This transition is defined by the color stops included in the gradient.
 */
export type LinearGradient = {
  /**
   * The x-coordinate of the gradient line's start point.
   */
  x0: number;

  /**
   * The y-coordinate of the gradient line's start point.
   */
  y0: number;

  /**
   * The x-coordinate of the gradient line's end point.
   */
  x1: number;

  /**
   * The y-coordinate of the gradient line's end point.
   */
  y1: number;

  /**
   * Color stops defining the colors and their positions along the gradient line.
   */
  colorStops: ColorStop[];
};
