import { BaseChartProperties } from './base-chart-properties';
import { DatumLine } from './datum-line';

/**
 * Represents the properties specific to drawing Y datum lines on a chart.
 *
 */
export type YDatumBaseChartProperties = BaseChartProperties & {
  /**
   * Reference lines drawn along the Y axis.
   */
  yDatumLines: DatumLine[];
};

/**
 * Represents the properties specific to drawing X and Y datum lines on a chart.
 *
 */
export type XYDatumBaseChartProperties = YDatumBaseChartProperties & {
  /**
   * Reference lines drawn along the X axis.
   */
  xDatumLines: DatumLine[];
};
