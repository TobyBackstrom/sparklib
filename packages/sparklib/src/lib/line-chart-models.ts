import { ChartProperties } from './base-chart-models';
import { LinearGradient, LinearGradientBuilder, Range } from './models';
import { LineProperties } from './models/line-properties';
import { DatumLine } from './models/datum-line';

export type LineChartProperties = {
  lineProps: LineProperties;
  chartProps: ChartProperties;

  fillStyle?: string | LinearGradient | LinearGradientBuilder;

  xDatumLines: DatumLine[];
  yDatumLines: DatumLine[];

  xDomain?: Range;
  yDomain?: Range;
};
