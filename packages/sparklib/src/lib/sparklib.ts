import { axis } from './axis';
import { barChart } from './bar-chart';
import { datumLine } from './builders/datum-line-builder';
import { lineProperties } from './builders/line-properties-builder';
import { linearGradient } from './builders/linear-gradient-builder';
import { margins } from './builders/margins-builder';
import { lineChart } from './line-chart';
import { stripeChart } from './stripe-chart';
import { getIndicesForPixelX } from './utils/get-indices-for-pixel-x';

export function sparklib() {
  return {
    // Charts
    axis,
    barChart,
    lineChart,
    stripeChart,

    /// Builders
    datumLine,
    linearGradient,
    lineProperties,
    margins,

    // Utils
    getIndicesForPixelX,
  };
}
