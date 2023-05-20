import { LineChartProperties } from '.';
import { LineChart } from '.';

// factory function (for simplicity to keep the fluid API going)
export const sparkline = (props?: LineChartProperties) => {
  return new LineChart(props);
};
