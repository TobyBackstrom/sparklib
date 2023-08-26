import { Margins } from './margins';
import { LinearGradient } from '.';
import { LinearGradientBuilder, MarginsBuilder } from '../builders';

/**
 * Represents the base properties for a chart.
 *
 * This includes dimensions, resolution, background color or gradient,
 * and margins configuration.
 */
export type BaseChartProperties = {
  /** The width of the chart in pixels. */
  width: number;

  /** The height of the chart in pixels. */
  height: number;

  /** The resolution in dots per inch. Optional. */
  dpi?: number;

  /**
   * The background color or gradient for the chart.
   * Accepts either a CSS color string or a gradient.
   * Optional.
   */
  background?: string | LinearGradient | LinearGradientBuilder | undefined;

  /**
   * The margins around the chart content.
   * It can either be a `Margins` object or a `MarginsBuilder` instance.
   * Optional.
   */
  margins?: Margins | MarginsBuilder;
};
