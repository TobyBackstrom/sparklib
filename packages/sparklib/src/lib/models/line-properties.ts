import { LinearGradient } from './linear-gradient';
import { LinearGradientBuilder } from './linear-gradient-builder';

/**
 * Describes the properties for styling a line.
 *
 * @remarks
 * This type is used to define various aspects of line rendering,
 * such as the stroke color, line width, and line dash pattern.
 *
 * @property {string | LinearGradient | LinearGradientBuilder} [strokeStyle] - The style of the stroke. This can either be a CSS color string, a `LinearGradient` object, or a `LinearGradientBuilder` instance. Default is "black".
 * @property {number} [lineWidth] - The width of the line. Default is 1.
 * @property {number[]} [lineDash] - The line dash pattern as an array of numbers. Refer to the [CanvasRenderingContext2D.setLineDash MDN documentation](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setLineDash) for details. Default is an empty array.
 *
 * @example
 * ```typescript
 * const lineProps: LineProperties = {
 *   strokeStyle: 'red',
 *   lineWidth: 2,
 *   lineDash: [5, 10]
 * };
 * ```
 */
export type LineProperties = {
  strokeStyle?: string | LinearGradient | LinearGradientBuilder; // default: "black"
  lineWidth?: number; // default: 1
  lineDash?: number[]; // default: [], https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setLineDash
};
