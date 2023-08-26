import { LineProperties } from './line-properties';

/**
 * Represents a datum line, which is a reference line for data plotting.
 *
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
 *
 * @typedef {object} DatumLine
 *
 * @property {number} position - The position of the line along the x or y axis. Defaults to 0.
 * @property {Required<LineProperties>} lineProperties - The visual properties of the line, such as stroke style, line width, and dash pattern.
 */
export type DatumLine = {
  position: number; // x or y, default: 0
  lineProperties: Required<LineProperties>;
};
