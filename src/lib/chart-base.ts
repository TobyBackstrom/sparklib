import * as dom from '../dom';

export interface ChartMargins {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export interface ChartProperties {
  width?: number;
  height?: number;
  dpi?: number;
}

export const NO_MARGINS: ChartMargins = {
  bottom: 0,
  left: 0,
  right: 0,
  top: 0,
};

export class ChartBase {
  protected chartProps: ChartProperties = { width: 250, height: 50 };
  protected backgroundProps: string | CanvasGradient | undefined = undefined;

  marginsProps: ChartMargins = {
    bottom: 2,
    left: 2,
    right: 2,
    top: 2,
  };

  constructor(props?: ChartProperties) {
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

  dpi(dpi: number) {
    this.chartProps.dpi = dpi;
    return this;
  }

  margins(margins: ChartMargins) {
    this.marginsProps = { ...this.marginsProps, ...margins };
    return this;
  }

  background(backgroundProps: string | CanvasGradient) {
    this.backgroundProps = backgroundProps;
    return this;
  }

  protected renderChartBase(): CanvasRenderingContext2D {
    const context = dom.context2d(
      this.chartProps.width!,
      this.chartProps.height!,
      this.chartProps.dpi
    );

    if (this.backgroundProps) {
      context.fillStyle = this.backgroundProps;
      context.fillRect(0, 0, this.chartProps.width!, this.chartProps.height!);
    }

    return context;
  }
}
