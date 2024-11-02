import { Axis } from '../lib/axis';
import { LineChart } from '../lib/line-chart';
import { BarChart } from '../lib/bar-chart';
import { sparklib } from '../lib/sparklib';
import { StripeChart } from '../lib';

describe('sparklib', () => {
  it('should return an object with chart factory functions that return charts', () => {
    const lib = sparklib();

    expect(typeof lib.axis).toBe('function');
    expect(typeof lib.barChart).toBe('function');
    expect(typeof lib.lineChart).toBe('function');
    expect(typeof lib.stripeChart).toBe('function');

    const axis = lib.axis();
    const barChart = lib.barChart();
    const lineChart = lib.lineChart();
    const stripeChart = lib.stripeChart();

    expect(axis instanceof Axis).toBe(true);
    expect(barChart instanceof BarChart).toBe(true);
    expect(lineChart instanceof LineChart).toBe(true);
    expect(stripeChart instanceof StripeChart).toBe(true);
  });
});
