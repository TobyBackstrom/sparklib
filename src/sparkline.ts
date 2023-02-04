import * as dom from './dom';
import { scaleLinear } from 'd3-scale';
import * as d3Array from 'd3-array';
import * as d3Shape from 'd3-shape';

export interface Margin {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export interface SparklineProperties {
  width: number;
  height: number;
  dpi?: number;
  color?: string;
  lineWidth?: number;
  margin?: Margin;
}

export function sparkline(
  values: number[],
  properties: SparklineProperties
): HTMLCanvasElement {
  const color = properties.color ?? 'black';
  const lineWidth = properties.lineWidth ?? 1;
  const margin: Margin = properties.margin ?? {
    left: 0.01,
    right: 0.01,
    top: 0.06,
    bottom: 0.06,
  };

  const horizontalMargin = margin.left + margin.right;
  const verticalMargin = margin.top + margin.bottom;

  const x = scaleLinear()
    .domain([0, values.length - 1])
    .range([
      properties.width * horizontalMargin,
      properties.width - properties.width * verticalMargin,
    ]);

  const yExtent = d3Array.extent(values) as [number, number];

  const y = scaleLinear()
    .domain(yExtent)
    .range([
      properties.height - properties.height * verticalMargin,
      properties.height * verticalMargin,
    ]) as any;

  const context = dom.context2d(
    properties.width,
    properties.height,
    properties.dpi
  );

  const line = (d: number[][]) => {
    context.beginPath();

    var lineDrawer = d3Shape
      .line<number[]>()
      .x((_, i) => x(i))
      .y(y)
      .context(context);

    lineDrawer(d);

    context.strokeStyle = color;
    context.lineWidth = lineWidth;

    context.stroke();
    context.closePath();
  };

  line(values.map((v, i) => [v, i]));

  return context.canvas;
}
