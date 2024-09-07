import * as d3Scale from 'd3-scale';

import { BaseChart } from './base-chart';
import { DatumLineBuilder } from './builders';
import {
  BaseChartProperties,
  Coordinate,
  DatumLine,
  LineProperties,
  Range,
} from './models';
import { DatumBaseChartProperties } from './models/datum-base-chart-properties';

type Properties = Omit<DatumBaseChartProperties, keyof BaseChartProperties>;

export abstract class DatumBaseChart extends BaseChart {
  #props: Properties;

  constructor(props?: Partial<DatumBaseChartProperties>) {
    super(props);

    this.#props = {
      xDatumLines: [...(props?.xDatumLines || [])],
      yDatumLines: [...(props?.yDatumLines || [])],
    };
  }

  // add a vertical reference line in the x domain
  xDatum(
    xPositionOrDatumLineBuilder: number | DatumLineBuilder,
    lineProps?: LineProperties,
    zIndex?: number,
  ): this {
    if (typeof xPositionOrDatumLineBuilder === 'number') {
      this.#datum(
        this.#props.xDatumLines,
        xPositionOrDatumLineBuilder,
        lineProps,
        zIndex,
      );
    } else {
      const datumLine = xPositionOrDatumLineBuilder.build();
      this.#datum(
        this.#props.xDatumLines,
        datumLine.position,
        datumLine.lineProperties,
        datumLine.zIndex,
      );
    }

    return this;
  }

  xDatumLines(datumLines: DatumLine[]) {
    this.#props.xDatumLines.push(...datumLines);
    return this;
  }

  // add a horizontal reference line in the y domain
  yDatum(
    yPositionOrDatumLineBuilder: number | DatumLineBuilder,
    lineProps?: LineProperties,
    zIndex?: number,
  ) {
    if (typeof yPositionOrDatumLineBuilder === 'number') {
      this.#datum(
        this.#props.yDatumLines,
        yPositionOrDatumLineBuilder,
        lineProps,
        zIndex,
      );
    } else {
      const datumLine = yPositionOrDatumLineBuilder.build();
      this.#datum(
        this.#props.yDatumLines,
        datumLine.position,
        datumLine.lineProperties,
        datumLine.zIndex,
      );
    }

    return this;
  }

  yDatumLines(datumLines: DatumLine[]) {
    this.#props.yDatumLines.push(...datumLines);
    return this;
  }

  protected renderDatumLines(
    context: CanvasRenderingContext2D,
    zIndex0: boolean, // only draw zIndex === 0 or not
    xDomain: Range,
    yDomain: Range,
    xScale: d3Scale.ScaleLinear<number, number, never>,
    yScale: d3Scale.ScaleLinear<number, number, never>,
  ) {
    this.#props.xDatumLines.forEach((datumLine) => {
      if (zIndex0 === false || datumLine.zIndex === 0) {
        this.#drawDatumLine('x', datumLine, xScale, yScale, yDomain, context);
      }
    });

    this.#props.yDatumLines.forEach((datumLine) => {
      if (zIndex0 === false || datumLine.zIndex === 0) {
        this.#drawDatumLine('y', datumLine, xScale, yScale, xDomain, context);
      }
    });
  }

  #datum(
    datumLines: DatumLine[],
    position: number,
    datumLineProps?: LineProperties,
    zIndex?: number,
  ) {
    const defaultDatumLineProps = {
      strokeStyle: 'black',
      lineDash: [1, 1],
      lineWidth: 1,
    };

    const lineProperties = {
      ...defaultDatumLineProps,
      ...datumLineProps,
    } as Required<LineProperties>;

    datumLines.push({ position, lineProperties, zIndex });
  }

  #drawDatumLine(
    axis: 'x' | 'y',
    datumLine: DatumLine,
    xScale: d3Scale.ScaleLinear<number, number, never>,
    yScale: d3Scale.ScaleLinear<number, number, never>,
    domain: Range,
    context: CanvasRenderingContext2D,
  ) {
    const scaledCoordinates: Coordinate[] =
      axis === 'x'
        ? [
            [xScale(datumLine.position), yScale(domain[0])],
            [xScale(datumLine.position), yScale(domain[1])],
          ]
        : [
            [xScale(domain[0]), yScale(datumLine.position)],
            [xScale(domain[1]), yScale(datumLine.position)],
          ];

    this.drawLine(scaledCoordinates, datumLine.lineProperties, context);
  }
}
