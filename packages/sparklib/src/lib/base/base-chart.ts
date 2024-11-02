import * as d3Shape from 'd3-shape';
import * as dom from '../dom';
import { LinearGradientBuilder, MarginsBuilder } from '../builders';
import {
  BaseChartProperties,
  Coordinate,
  LinearGradient,
  LineProperties,
  Margins,
} from '../models';

const DEFAULT_MARGINS: Margins = {
  bottom: 0,
  left: 0,
  right: 0,
  top: 0,
};

type BaseChartPropertiesWithMargins = Omit<BaseChartProperties, 'margins'> & {
  margins: Required<Margins>;
};

type PartialBaseChartProperties = Partial<
  Omit<BaseChartProperties, 'margins'>
> & {
  margins?: Margins | MarginsBuilder;
};

export type ValueAccessor<T> = ((obj: T) => number | null) | undefined;

export abstract class BaseChart {
  protected chartProps: BaseChartPropertiesWithMargins = {
    width: 250,
    height: 50,
    dpi: undefined,
    background: undefined,
    margins: DEFAULT_MARGINS,
  };

  constructor(props?: PartialBaseChartProperties) {
    if (props?.margins) {
      // eslint-disable-next-line prefer-const
      let { margins, ...otherProps } = props;

      if (margins !== undefined) {
        margins = this.getMargins(margins);
      } else {
        margins = this.chartProps.margins;
      }

      props.margins = this.getMargins(props.margins);

      this.chartProps = { ...this.chartProps, ...otherProps, margins };
    }
  }

  width(width: number) {
    this.chartProps.width = width;
    return this;
  }

  height(height: number) {
    this.chartProps.height = height;
    return this;
  }

  dpi(dpi?: number) {
    this.chartProps.dpi = dpi;
    return this;
  }

  margins(margins?: Partial<Margins> | MarginsBuilder) {
    this.chartProps.margins = this.getMargins(margins);
    return this;
  }

  background(
    backgroundProps:
      | string
      | LinearGradient
      | LinearGradientBuilder
      | undefined,
  ) {
    this.chartProps.background = backgroundProps;
    return this;
  }

  protected getFillStyle(
    fillStyle: string | LinearGradient | LinearGradientBuilder,
    context: CanvasRenderingContext2D,
  ): string | CanvasGradient {
    if (typeof fillStyle === 'string') {
      return fillStyle;
    } else if (fillStyle instanceof LinearGradientBuilder) {
      return dom.createLinearGradient(fillStyle.build(), context);
    } else {
      return dom.createLinearGradient(fillStyle as LinearGradient, context);
    }
  }

  protected getMargins(margins?: Partial<Margins> | MarginsBuilder) {
    if (margins instanceof MarginsBuilder) {
      return margins.build();
    } else {
      return margins
        ? { ...DEFAULT_MARGINS, ...margins }
        : { left: 0, top: 0, right: 0, bottom: 0 };
    }
  }

  protected renderChartBase(
    canvas?: HTMLCanvasElement,
  ): CanvasRenderingContext2D {
    const context = dom.context2d(
      this.chartProps.width,
      this.chartProps.height,
      this.chartProps.dpi,
      canvas,
    );

    if (this.chartProps.background !== undefined) {
      context.fillStyle = this.getFillStyle(
        this.chartProps.background,
        context,
      );
      context.fillRect(0, 0, this.chartProps.width, this.chartProps.height);
    }

    return context;
  }

  protected drawLine(
    coordinates: Coordinate[],
    lineProperties: Required<LineProperties>,
    context: CanvasRenderingContext2D,
  ): void {
    const strokeStyle = this.getFillStyle(lineProperties.strokeStyle, context);
    const lineWidthOffset = lineProperties.lineWidth === 1 ? 0.5 : 0; // offset to avoid anti-aliasing widening the line

    context.beginPath();

    d3Shape
      .line<Coordinate>()
      .defined((coordinate) => coordinate[1] != null)
      .x((coordinate) => coordinate[0] + lineWidthOffset)
      .y((coordinate) => coordinate[1] + lineWidthOffset)
      .context(context)(coordinates);

    context.strokeStyle = strokeStyle;
    context.lineCap = 'round';
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    context.setLineDash(lineProperties.lineDash!);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    context.lineWidth = lineProperties.lineWidth!;
    context.stroke();
    context.closePath();
  }
}
