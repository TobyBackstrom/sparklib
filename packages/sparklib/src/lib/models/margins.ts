/**
 * Represents the margins around a chart area.
 *
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
 *
 * @typedef {object} Margins
 *
 * @property {number} left - The left margin in pixels.
 * @property {number} top - The top margin in pixels.
 * @property {number} right - The right margin in pixels.
 * @property {number} bottom - The bottom margin in pixels.
 */
export type Margins = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};
