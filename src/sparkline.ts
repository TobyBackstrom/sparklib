import { ChartBase, ChartProperties } from './chart-base';

export const chart = (props?: ChartProperties) => {
  return new ChartBase(props);
};
