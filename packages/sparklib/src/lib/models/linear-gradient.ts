import { ColorStop } from './color-stop';

/**
 * Represents a linear gradient.
 *
 * A linear gradient defines color transitions along a line.
 * This transition is defined by the color stops included in the gradient.
 *
 * @typedef {object} LinearGradient
 *
 * @property {number} x0 - The x-coordinate of the gradient line's start point.
 * @property {number} y0 - The y-coordinate of the gradient line's start point.
 *
 * @property {number} x1 - The x-coordinate of the gradient line's end point.
 * @property {number} y1 - The y-coordinate of the gradient line's end point.
 *
 * @property {ColorStop[]} colorStops - An array of color stops defining the colors and their positions along the gradient line.
 */
export type LinearGradient = {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  colorStops: ColorStop[];
};
