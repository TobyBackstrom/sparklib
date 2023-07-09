import * as d3Scale from 'd3-scale';
import * as d3Interpolate from 'd3-interpolate';
import { Range } from '../models';

/**
 * Creates a D3 quantize color scale with a specified range (domain), color set, and number of color levels.
 *
 * The color scale can be used to map a numeric input domain to discrete color levels.
 *
 * @param domain - A tuple representing the range of the input values.
 *                 The first element is the minimum value, and the second element is the maximum value.
 *
 * @param colors - An array of CSS color strings to be used in the gradient.
 *                 The colors are interpolated to create the color levels.
 *
 * @param numColorLevels - The number of discrete color levels to generate.
 *                         The input domain is divided into this many equally sized sections,
 *                         each mapping to a color level.
 *
 * @returns A D3 scaleQuantize function, which maps the input domain to the generated color levels.
 */
export function createGradientColorScale(
  domain: Range,
  colors: string[],
  numColorLevels: number,
) {
  // a continuous RGB color interpolator
  const colorInterpolator = d3Interpolate.interpolateRgbBasis(colors);

  // discrete color levels
  const gradientColors = d3Interpolate.quantize(
    (t) => colorInterpolator(t),
    numColorLevels,
  );

  // finally a d3.scaleQuantize scale
  const colorScale = d3Scale
    .scaleQuantize<string>()
    .domain([domain[0], domain[1]])
    .range(gradientColors);

  return colorScale;
}
