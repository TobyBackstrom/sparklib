import { ChartMargins, ChartProperties, NO_MARGINS } from './base-chart-models';
import { LinearGradient, LinearGradientBuilder } from './models';
import * as dom from './dom';

const DEFAULT_MARGINS: ChartMargins = {
  bottom: 2,
  left: 2,
  right: 2,
  top: 2,
};

type BaseProperties = {
  margins: Required<ChartMargins>;
} & ChartProperties;

export abstract class BaseChart {
  protected chartProps: BaseProperties = {
    width: 250,
    height: 50,
    dpi: undefined,
    background: undefined,
    margins: DEFAULT_MARGINS,
  };

  constructor(props?: Partial<ChartProperties>) {
    this.chartProps = { ...this.chartProps, ...props };
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

  margins(margins?: Partial<ChartMargins>) {
    this.chartProps.margins = margins
      ? { ...DEFAULT_MARGINS, ...margins }
      : NO_MARGINS;
    return this;
  }

  background(
    backgroundProps: string | LinearGradient | LinearGradientBuilder | undefined
  ) {
    this.chartProps.background = backgroundProps;
    return this;
  }

  protected getFillStyle(
    fillStyle: string | LinearGradient | LinearGradientBuilder,
    context: CanvasRenderingContext2D
  ): string | CanvasGradient {
    if (typeof fillStyle === 'string') {
      return fillStyle;
    } else if (fillStyle instanceof LinearGradientBuilder) {
      return dom.createLinearGradient(fillStyle.build(), context);
    } else {
      return dom.createLinearGradient(fillStyle as LinearGradient, context);
    }
  }

  protected renderChartBase(): CanvasRenderingContext2D {
    const context = dom.context2d(
      this.chartProps.width,
      this.chartProps.height,
      this.chartProps.dpi
    );

    if (this.chartProps.background !== undefined) {
      context.fillStyle = this.getFillStyle(
        this.chartProps.background,
        context
      );
      context.fillRect(0, 0, this.chartProps.width, this.chartProps.height);
    }

    return context;
  }
}
