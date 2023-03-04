import { SparklineParameters } from './lib';
import { LineChart } from './lib';

// factory function (for simplicity to keep the fluid API going)
export const sparkline = (params?: SparklineParameters) => {
  return new LineChart(params);
};
