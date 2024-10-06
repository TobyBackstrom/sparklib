import { LinearGradient, Range } from '.';
import { LinearGradientBuilder } from '../builders/linear-gradient-builder';
import { YDatumBaseChartProperties } from './datum-base-chart-properties';

export type BarChartProperties = YDatumBaseChartProperties & {
  /**
   * The domain of data along the Y (category) axis. Defines the range of data values
   * to be displayed. If not specified, it will be automatically determined.
   */
  domain: Range | undefined;

  /**
   * The width in pixels of bars. If not specified, it will be automatically determined.
   */
  barWidth?: number;

  /**
   * The distance in pixels between bars. If not specified,
   * a default value of 2% of the chart width will be used.
   */
  barPadding?: number;

  /**
   * The style used to fill the bars. Can be a color, gradient,
   * or a builder for a gradient.
   */
  fillStyle?: string | LinearGradient | LinearGradientBuilder;
};
