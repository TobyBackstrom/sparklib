import { BaseChartProperties } from './base-chart-properties';
import { DatumLine } from './datum-line';

/**
 * Represents the properties specific to drawing datum lines on a chart.
 *
 */
export type DatumBaseChartProperties = BaseChartProperties & {
  // /**
  //  * The basic chart properties including dimensions, background, and margins.
  //  */
  // baseChartProps: BaseChartProperties;

  /**
   * Reference lines drawn along the X axis.
   */
  xDatumLines: DatumLine[];

  /**
   * Reference lines drawn along the Y axis.
   */
  yDatumLines: DatumLine[];
};
