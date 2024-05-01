import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ChartMouseEvent,
  LinearGradient,
  LinearGradientBuilder,
  Margins,
  MarginsBuilder,
  MouseEventType,
  Range,
  StripeChart,
  StripeChartProperties,
  StripeValueType,
  ValueAccessor,
  stripeChart,
} from 'sparklib';

@Component({
  selector: 'sparklib-stripe-chart',
  standalone: true,
  imports: [CommonModule],
  template:
    '<canvas #canvasRef [style.height.px]="height" style="display: block; margin: 0; padding: 0; border: none;"></canvas>',
  styles: [],
})
export class StripeChartComponent<T = unknown>
  implements AfterViewInit, OnDestroy
{
  // mandatory properties
  @Input({ required: true }) values!: StripeValueType<T>[];

  // optional value accssor
  @Input() valueAccessor: ValueAccessor<T>;

  // optional properties
  @Input() width?: number;
  @Input() height?: number;
  @Input() dpi?: number;
  @Input() margins?: Partial<Margins> | MarginsBuilder;
  @Input() background?: string | LinearGradient | LinearGradientBuilder;
  @Input() gradientColors?: string[];
  @Input() nGradientColorLevels?: number;
  @Input() domain?: Range | undefined;
  @Input() properties?: StripeChartProperties;

  @Input() mouseEventTypes?: MouseEventType[];
  @Output() mouseEvent = new EventEmitter<ChartMouseEvent>();

  @ViewChild('canvasRef') canvasRef!: ElementRef<HTMLCanvasElement>;

  stripeChart?: StripeChart<T>;

  ngAfterViewInit(): void {
    this.stripeChart = stripeChart<T>(this.properties);
    this.#setChartProperties(this.stripeChart);
    this.#setupMouseListener(this.stripeChart);
    this.stripeChart.render(this.values, this.canvasRef.nativeElement);
  }

  ngOnDestroy() {
    this.stripeChart?.dispose();
  }

  onMouseEvent(chartMouseEvent: ChartMouseEvent) {
    this.mouseEvent.emit(chartMouseEvent);
  }

  #setChartProperties(chart: StripeChart<T>) {
    const inputMappings = this.#getInputToChartMappings(chart);

    Object.entries(inputMappings).forEach(([key, method]) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const value = (this as any)[key];
      if (value !== undefined && method) {
        method.call(chart, value);
      }
    });
  }

  #setupMouseListener(chart: StripeChart<T>) {
    if (
      this.mouseEvent.observed &&
      this.mouseEventTypes &&
      this.mouseEventTypes.length > 0
    ) {
      chart.mouseEventListener(
        this.mouseEventTypes,
        this.onMouseEvent.bind(this),
      );
    }
  }

  #getInputToChartMappings(
    chart: StripeChart<T>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Record<string, (arg: any) => StripeChart<T>> {
    return {
      width: chart.width,
      height: chart.height,
      dpi: chart.dpi,
      margins: chart.margins,
      background: chart.background,
      gradientColors: chart.gradientColors,
      nGradientColorLevels: chart.nGradientColorLevels,
      domain: chart.domain,
      valueAccessor: chart.valueAccessor,
    };
  }
}
