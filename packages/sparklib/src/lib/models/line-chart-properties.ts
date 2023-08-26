import {
  BaseChartProperties,
  DatumLine,
  LinearGradient,
  LineProperties,
  Range,
} from '.';
import { LinearGradientBuilder } from '../builders';

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
export type LineChartProperties = {
  /**
   * The properties used for rendering the lines in the chart.
   */
  lineProps: LineProperties;

  /**
   * The basic chart properties including dimensions, background, and margins.
   */
  baseChartProps: BaseChartProperties;

  /**
   * The style used to fill the area beneath the line in the chart.
   * Can be a color, gradient, or a builder for a gradient.
   */
  fillStyle?: string | LinearGradient | LinearGradientBuilder;

  /**
   * Reference lines drawn along the X axis.
   */
  xDatumLines: DatumLine[];

  /**
   * Reference lines drawn along the Y axis.
   */
  yDatumLines: DatumLine[];

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
