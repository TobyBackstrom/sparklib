import { LinearGradient, LineProperties, Range } from '.';
import { LinearGradientBuilder } from '../builders';
import { DatumBaseChartProperties } from './datum-base-chart-properties';

/**
 * Represents the properties specific to a Line Chart.
 *
 * @remarks
 * This type extends the base chart properties to include configurations
 * unique to line charts, such as line styling, fill styles, datum lines,
 * and domain ranges for both the x and y axes.
 *
 * @example
 * ```typescript
 * const myLineChartProperties: LineChartProperties = {
 *   lineProps: { ... },
 *   baseChartProps: { ... },
 *   fillStyle: 'red',
 *   xDatumLines: [...],
 *   yDatumLines: [...]
 * };
 * ```
 */
export type LineChartProperties = DatumBaseChartProperties & {
  /**
   * The properties used for rendering the lines in the chart.
   */
  lineProps: LineProperties;

  /**
   * The style used to fill the area beneath the line in the chart.
   * Can be a color, gradient, or a builder for a gradient.
   */
  fillStyle?: string | LinearGradient | LinearGradientBuilder;

  /**
   * The domain of data along the X axis. Defines the range of data values
   * to be displayed. If not specified, it will be automatically determined.
   */
  xDomain?: Range;

  /**
   * The domain of data along the Y axis. Defines the range of data values
   * to be displayed. If not specified, it will be automatically determined.
   */
  yDomain?: Range;
};
