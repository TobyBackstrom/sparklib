import { ChartProperties, NO_MARGINS } from './base-chart-models';
import { Margins, MarginsBuilder } from './models';
import { LinearGradient, LinearGradientBuilder } from './models';
import * as dom from './dom';

const DEFAULT_MARGINS: Margins = {
  bottom: 2,
  left: 2,
  right: 2,
  top: 2,
};

type BaseProperties = Omit<ChartProperties, 'margins'> & {
  margins: Required<Margins>;
};

type PartialBaseProperties = Partial<Omit<ChartProperties, 'margins'>> & {
  margins?: Margins | MarginsBuilder;
};

export abstract class BaseChart {
  protected chartProps: BaseProperties = {
    width: 250,
    height: 50,
    dpi: undefined,
    background: undefined,
    margins: DEFAULT_MARGINS,
  };

  constructor(props?: PartialBaseProperties) {
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

  protected getMargins(margins?: Partial<Margins> | MarginsBuilder) {
    if (margins instanceof MarginsBuilder) {
      return margins.build();
    } else {
      return margins ? { ...DEFAULT_MARGINS, ...margins } : NO_MARGINS;
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
