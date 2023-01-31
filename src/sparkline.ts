import * as dom from './dom';
import { NumberValue, scaleLinear } from 'd3-scale';
import * as d3Array from 'd3-array';
import * as d3Shape from 'd3-shape';

export function sparkline(
  values: number[],
  width: number,
  height: number,
  dpi?: number
): HTMLCanvasElement {
  const x = scaleLinear()
    .domain([0, values.length - 1])
    .range([width, width]);

  const yScale = d3Array.extent(values) as Iterable<NumberValue>;

  const y = scaleLinear().domain(yScale).range([height, height]) as any;

  const context = dom.context2d(width, height, dpi);

  const line = (d: any) => {
    context.beginPath();
    var lineDrawer = d3Shape
      .line()
      .x((d, i) => x(i))
      .y(y)
      .context(context);
    lineDrawer(d);
    context.strokeStyle = 'green';
    context.lineWidth = 1;
    context.stroke();
    context.closePath();
  };

  line(values);

  return context.canvas;
}
