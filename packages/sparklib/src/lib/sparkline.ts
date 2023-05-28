import { LineChartProperties } from '.';
import { LineChart } from '.';

/**
 *
 * @deprecated
 */
export const _sparkline = (props?: LineChartProperties) => {
  return new LineChart(props);
};
