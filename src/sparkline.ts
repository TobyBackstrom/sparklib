import { LineChart, SparklineParameters } from './chart-base';

// factory function (for simplicity to keep the fluid API going)
export const sparkline = (params: SparklineParameters) => {
  return new LineChart(params);
};
