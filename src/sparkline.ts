import * as dom from './dom';
import * as d3Scale from 'd3-scale';
import * as d3Array from 'd3-array';
import * as d3Shape from 'd3-shape';
import * as d3Color from 'd3-color';

export interface ChartMargins {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export interface AreaProperties {
  fillStyle?: string | CanvasGradient; // default: "black with opacity 0.3"
}

export interface LineProperties {
  strokeStyle?: string | CanvasGradient; // default: "black"
  lineWidth?: number; // default: 1
  lineDash?: number[]; // default: [], https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setLineDash
}

export interface DatumLineProperties extends LineProperties {
  y: number; // default: 0
}

export interface ChartProperties {
  width?: number;
  height?: number;
  dpi?: number;
}

export const chart = (props?: ChartProperties) => {
  let _chartProps = { width: 250, height: 50, ...props };
  let _background: string | CanvasGradient | undefined = undefined;

  let _marginProps = {
    bottom: 2,
    left: 2,
    right: 2,
    top: 2,
  };

  let _lineProps: LineProperties | undefined = undefined;
  let _datumLines: DatumLineProperties[] = [];

  let _xDomain: [number, number];
  let _yDomain: [number, number];

  const width = (_: number) => {
    _chartProps.width = _;
    return exports;
  };

  const height = (_: number) => {
    _chartProps.height = _;
    return exports;
  };

  const dpi = (_: number) => {
    _chartProps.dpi = _;
    return exports;
  };

  const margins = (_: ChartMargins) => {
    _marginProps = { ..._marginProps, ..._ };
    return exports;
  };

  // minX - maxX
  const xDomain = (_: [number, number]) => {
    _xDomain = _;
    return exports;
  };

  // minY - maxY
  const yDomain = (_: [number, number]) => {
    _yDomain = _;
    return exports;
  };

  // add horizontal reference lines in the y domain
  const datum = (y: number, lineProps?: LineProperties) => {
    const defaultLineProps = {
      strokeStyle: 'black',
      lineDash: [],
      lineWidth: 1,
    };

    _datumLines.push({ y, ...defaultLineProps, ...lineProps });
    return exports;
  };

  const background = (_: string | CanvasGradient) => {
    _background = _;
    return exports;
  };

  const line = (_?: LineProperties) => {
    const defaultLineProps = {
      strokeStyle: 'black',
      lineDash: [],
      lineWidth: 1,
    };

    _lineProps = _ ? { ...defaultLineProps, ..._ } : defaultLineProps;

    return exports;
  };

  const render = (
    values: number[],
    tmp: [number, number][]
  ): HTMLCanvasElement => {
    const xScale = d3Scale
      .scaleLinear()
      .domain(_xDomain ?? [0, values.length - 1])
      .range([_marginProps.left, _chartProps.width - _marginProps.right]);

    const yScale = d3Scale
      .scaleLinear()
      .domain(_yDomain ?? (d3Array.extent(values) as [number, number]))
      .range([_chartProps.height - _marginProps.top, _marginProps.bottom]);

    const context = dom.context2d(
      _chartProps.width,
      _chartProps.height,
      _chartProps.dpi
    );

    if (_background) {
      context.fillStyle = _background;
      context.fillRect(0, 0, _chartProps.width, _chartProps.height);
    }

    _datumLines.forEach((datum) =>
      drawLine(
        [
          [0, datum.y ?? 0],
          [values.length - 1, datum.y ?? 0],
        ],
        xScale,
        yScale,
        datum,
        context
      )
    );

    if (_lineProps) {
      drawPath(values, xScale, yScale, _lineProps, context);
    }

    return context.canvas;
  };

  const exports = {
    width,
    height,
    dpi,
    margins,
    xDomain,
    yDomain,
    datum,
    background,
    line,
    render,
  };

  return exports;
};

function drawLine(
  coordinates: number[][], // (x0, y0) -> (x1, y1)
  xScale: any,
  yScale: any,
  lineProperties: LineProperties,
  context: CanvasRenderingContext2D
) {
  const line = (data: number[][]) => {
    context.beginPath();

    context.moveTo(xScale(coordinates[0][0]), yScale(coordinates[0][1]));
    context.lineTo(xScale(coordinates[1][0]), yScale(coordinates[1][1]));

    setContextLineProperties(lineProperties, context);

    context.stroke();
    context.closePath();
  };

  line(coordinates);
}

function drawPath(
  values: number[],
  xScale: any,
  yScale: any,
  lineProperties: LineProperties,
  context: CanvasRenderingContext2D
) {
  const line = (data: number[]) => {
    context.beginPath();

    const line = d3Shape
      .line<number>()
      .x((_, i) => xScale(i))
      .y(yScale)
      .context(context)(data);

    setContextLineProperties(lineProperties, context);

    context.stroke();
    context.closePath();
  };

  line(values);
}

function setContextLineProperties(
  props: LineProperties,
  context: CanvasRenderingContext2D
) {
  context.strokeStyle = props.strokeStyle!;
  context.setLineDash(props.lineDash!);
  context.lineWidth = props.lineWidth!;
}

function getAreaFillstyle(
  area: AreaProperties,
  fallback: LineProperties
): string | CanvasGradient | CanvasPattern {
  if (area?.fillStyle) {
    return area.fillStyle!;
  }

  if (
    typeof fallback?.strokeStyle === 'string' ||
    fallback?.strokeStyle == null
  ) {
    const fillStyle = fallback?.strokeStyle || 'black';
    const color = d3Color.color(fillStyle)?.copy({ opacity: 0.3 });
    return color!.formatHex8();
  }

  return area.fillStyle!;
}

function is2DArray(array: any[]): boolean {
  return array.every((element) => Array.isArray(element));
}
