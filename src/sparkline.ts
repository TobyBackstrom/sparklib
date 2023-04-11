import { LineChartParameters } from './lib';
import { LineChart } from './lib';

// factory function (for simplicity to keep the fluid API going)
export const sparkline = (params?: LineChartParameters) => {
  return new LineChart(params);
};
