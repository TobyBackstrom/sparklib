import { Margins } from './margins';
import { LinearGradient } from '.';
import { LinearGradientBuilder, MarginsBuilder } from '../builders';

/**
 * Represents the base properties for a chart.
 *
 * This includes dimensions, resolution, background color or gradient,
 * and margins configuration.
 *
 * @typedef {object} BaseChartProperties
 *
 * @property {number} width - The width of the chart in pixels.
 * @property {number} height - The height of the chart in pixels.
 * @property {number} [dpi=undefined] - The resolution in dots per inch.
 * @property {string | LinearGradient | LinearGradientBuilder} [background=undefined] - The background color or gradient for the chart. Accepts either a CSS color string or a gradient.
 * @property {Margins | MarginsBuilder} [margins=undefined] - The margins around the chart content. It can either be a `Margins` object or a `MarginsBuilder` instance.
 */
export type BaseChartProperties = {
  width: number;
  height: number;
  dpi?: number;
  background?: string | LinearGradient | LinearGradientBuilder | undefined;
  margins?: Margins | MarginsBuilder;
};
