import * as dom from '../dom';
import { LinearGradient } from './linear-gradient';

export enum ArrayType {
  SingleNumbers = 'SingleNumbers',
  NumberPairs = 'NumberPairs',
}

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
  protected backgroundProps: string | LinearGradient | undefined = undefined;

  protected marginsProps: ChartMargins = {
    bottom: 2,
    left: 2,
    right: 2,
    top: 2,
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

  dpi(dpi: number) {
    this.chartProps.dpi = dpi;
    return this;
  }

  margins(margins?: Partial<ChartMargins>) {
    this.marginsProps = margins
      ? { ...this.marginsProps, ...margins }
      : NO_MARGINS;
    return this;
  }

  background(backgroundProps: string | LinearGradient) {
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
      const fillStyle =
        this.backgroundProps instanceof LinearGradient
          ? this.backgroundProps.getCanvasGradient(context)
          : this.backgroundProps;

      context.fillStyle = fillStyle;
      context.fillRect(0, 0, this.chartProps.width!, this.chartProps.height!);
    }

    return context;
  }

  protected getArrayType(values: (number | [number, number])[]): ArrayType {
    if (Array.isArray(values) && values.length > 0) {
      const firstValue = values[0];
      if (typeof firstValue === 'number') {
        return ArrayType.SingleNumbers;
      } else if (Array.isArray(firstValue) && firstValue.length === 2) {
        if (
          typeof firstValue[0] === 'number' &&
          typeof firstValue[1] === 'number'
        ) {
          return ArrayType.NumberPairs;
        }
      }
    }

    throw new Error(
      'Invalid input format. Expected an array of numbers or an array of number pairs.'
    );
  }
}
