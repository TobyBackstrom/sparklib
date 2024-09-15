import { Range } from '.';
import { YDatumBaseChartProperties } from './datum-base-chart-properties';

export type BarChartProperties = YDatumBaseChartProperties & {
  domain: Range | undefined;
  barWidth?: number;
  barPadding?: number;
};
