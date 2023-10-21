import { LineProperties } from './line-properties';

/**
 * Represents a datum line, which is a reference line for data plotting.
 *
 * @remarks
 * A datum line can be vertical or horizontal and is defined by its `position`
 * along the respective axis and its visual `lineProperties`.
 *
 * @example
 * ```typescript
 * const myDatumLine: DatumLine = {
 *   position: 5,
 *   lineProperties: {
 *     strokeStyle: 'red',
 *     lineWidth: 2,
 *     lineDash: [5, 10]
 *   }
 * };
 * ```
 */
export type DatumLine = {
  /**
   * The position of the line along the x or y axis. Defaults to 0.
   */
  position: number;

  /**
   * The zIndex of the line. Set to 0 to draw the line on the background, under the values.
   */
  zIndex?: number;

  /**
   * The visual properties of the line, such as stroke style, line width, and dash pattern.
   */
  lineProperties: Required<LineProperties>;
};
