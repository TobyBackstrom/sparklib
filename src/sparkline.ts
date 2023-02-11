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
  margins?: ChartMargins;
  area?: AreaProperties;
  line?: LineProperties;
  datumLines: DatumLineProperties[];
  background?: string | CanvasGradient;
}

const defaultChartProperties: ChartProperties = {
  width: 250,
  height: 50,
  margins: {
    bottom: 2,
    left: 2,
    right: 2,
    top: 2,
  },
  area: undefined,
  line: {
    lineWidth: 1,
    strokeStyle: 'black',
  },
  datumLines: [],
};

export const chart = (properties?: ChartProperties) => {
  let _width = properties?.width ?? defaultChartProperties.width!;
  let _height = properties?.height ?? defaultChartProperties.height!;
  let _dpi = properties?.dpi;
  let _xDomain: [number, number];
  let _yDomain: [number, number];
  let _marginProps = {
    ...defaultChartProperties.margins!,
    ...properties?.margins,
  };
  let _lineProps: LineProperties | undefined = properties?.line
    ? { ...properties?.line }
    : undefined;
  let _datumLines = properties?.datumLines
    ? [...properties?.datumLines]
    : [...defaultChartProperties.datumLines];
  let _background: string | CanvasGradient | undefined = properties?.background;

  const width = (_: number) => {
    _width = _;
    return exports;
  };

  const height = (_: number) => {
    _height = _;
    return exports;
  };

  const dpi = (_: number) => {
    _dpi = _;
    return exports;
  };

  const margins = (_: ChartMargins) => {
    _marginProps = { ..._marginProps, ..._ };
    return exports;
  };

  const xDomain = (_: [number, number]) => {
    _xDomain = _;
    return exports;
  };

  const yDomain = (_: [number, number]) => {
    _yDomain = _;
    return exports;
  };

  // add horizontal reference lines in the y domain
  const datum = (y: number, lineProps?: LineProperties) => {
    _datumLines.push({ y, ...lineProps });
    return exports;
  };

  const background = (_: string | CanvasGradient) => {
    _background = _;
    return exports;
  };

  const line = (_?: LineProperties) => {
    _lineProps = _ ? _ : defaultLineProperties;
    return exports;
  };

  const render = (values: number[]): HTMLCanvasElement => {
    const xScale = d3Scale
      .scaleLinear()
      .domain(_xDomain ?? [0, values.length - 1])
      .range([_marginProps.left, _width - _marginProps.right]);

    const yScale = d3Scale
      .scaleLinear()
      .domain(_yDomain ?? (d3Array.extent(values) as [number, number]))
      .range([_height - _marginProps.top, _marginProps.bottom]);

    const context = dom.context2d(_width, _height, _dpi);

    if (_background) {
      context.fillStyle = _background;
      context.fillRect(0, 0, _width, _height);
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
  properties: LineProperties,
  context: CanvasRenderingContext2D
) {
  const strokeStyle =
    properties.strokeStyle ?? defaultLineProperties.strokeStyle;
  const lineWidth = properties.lineWidth ?? defaultLineProperties.lineWidth;
  const lineDash = properties.lineDash ?? defaultLineProperties.lineDash;

  context.strokeStyle = strokeStyle!;
  context.setLineDash(lineDash!);
  context.lineWidth = lineWidth!;
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

const defaultLineProperties: LineProperties = {
  strokeStyle: 'black',
  lineDash: [],
  lineWidth: 1,
};
