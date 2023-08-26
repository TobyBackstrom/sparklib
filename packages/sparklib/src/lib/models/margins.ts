/**
 * Represents the margins around a chart area.
 *
 * @remarks
 * Defines the space between the edges of the chart and its content
 * in terms of pixels. Each side of the chart can have a different
 * margin size.
 *
 * @example
 * ```typescript
 * const myMargins: Margins = {
 *   left: 10,
 *   top: 20,
 *   right: 10,
 *   bottom: 20
 * };
 * ```
 */
export type Margins = {
  /**
   * The left margin in pixels.
   */
  left: number;

  /**
   * The top margin in pixels.
   */
  top: number;

  /**
   * The right margin in pixels.
   */
  right: number;

  /**
   * The bottom margin in pixels.
   */
  bottom: number;
};
