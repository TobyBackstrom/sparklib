import {
  BaseChartProperties,
  DatumLine,
  LinearGradient,
  LinearGradientBuilder,
  LineProperties,
  Range,
} from '.';

/**
 * Represents the properties specific to a Line Chart.
 *
 * This type extends the base chart properties to include configurations
 * unique to line charts, such as line styling, fill styles, datum lines,
 * and domain ranges for both the x and y axes.
 *
 * @typedef {object} LineChartProperties
 *
 * @property {LineProperties} lineProps - The properties used for rendering the lines in the chart.
 * @property {BaseChartProperties} baseChartProps - The basic chart properties including dimensions, background, and margins.
 * @property {string | LinearGradient | LinearGradientBuilder} [fillStyle=undefined] - The style used to fill the area beneath the line in the chart. Can be a color, gradient, or a builder for a gradient.
 * @property {DatumLine[]} xDatumLines - An array of reference lines drawn along the X axis.
 * @property {DatumLine[]} yDatumLines - An array of reference lines drawn along the Y axis.
 * @property {Range} [xDomain=undefined] - The domain of data along the X axis. Defines the range of data values to be displayed. If not specified, it will be automatically determined.
 * @property {Range} [yDomain=undefined] - The domain of data along the Y axis. Defines the range of data values to be displayed. If not specified, it will be automatically determined.
 */
export type LineChartProperties = {
  lineProps: LineProperties;
  baseChartProps: BaseChartProperties;

  fillStyle?: string | LinearGradient | LinearGradientBuilder;

  xDatumLines: DatumLine[];
  yDatumLines: DatumLine[];

  xDomain?: Range;
  yDomain?: Range;
};
