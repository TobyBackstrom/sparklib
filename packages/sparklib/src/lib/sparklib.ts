import { barChart } from './bar-chart';
import { lineChart } from './line-chart';
import { stripeChart } from './stripe-chart';
import { axis } from './axis';

export function sparklib() {
  return {
    axis,
    barChart,
    lineChart,
    stripeChart,
  };
}
