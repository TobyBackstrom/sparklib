import { Range } from '.';
import { DatumBaseChartProperties } from './datum-base-chart-properties';

export type BarChartProperties = DatumBaseChartProperties & {
  domain: Range | undefined;
  barWidth?: number;
  barPadding?: number;
};
