import { LinearGradient } from './linear-gradient';
import { LinearGradientBuilder } from '../builders';

/**
 * Describes the properties for styling a line.
 *
 * @remarks
 * This type is used to define various aspects of line rendering,
 * such as the stroke color, line width, and line dash pattern.
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
  /**
   * The style of the stroke. This can either be a CSS color string,
   * a `LinearGradient` object, or a `LinearGradientBuilder` instance.
   * @defaultValue "black"
   */
  strokeStyle?: string | LinearGradient | LinearGradientBuilder;

  /**
   * The width of the line.
   * @defaultValue 1
   */
  lineWidth?: number;

  /**
   * The line dash pattern as an array of numbers.
   * Refer to the [CanvasRenderingContext2D.setLineDash MDN documentation](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setLineDash) for details.
   * @defaultValue []
   */
  lineDash?: number[];
};
