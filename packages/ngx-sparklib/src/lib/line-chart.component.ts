import { CommonModule } from '@angular/common';
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
import {
  ChartMouseEvent,
  DatumLine,
  LineChart,
  LineChartProperties,
  LineValueType,
  LinearGradient,
  LinearGradientBuilder,
  Margins,
  MarginsBuilder,
  MouseEventType,
  Range,
  ValueAccessor,
  lineChart,
} from 'sparklib';

@Component({
  selector: 'sparklib-line-chart',
  standalone: true,
  imports: [CommonModule],
  template: '<canvas #canvasRef></canvas>',
  styles: [],
})
export class LineChartComponent<T = unknown>
  implements AfterViewInit, OnDestroy
{
  // mandatory properties
  @Input({ required: true }) values!: LineValueType<T>[];

  // optional value properties
  @Input() xAccessor: ValueAccessor<T>;
  @Input() yAccessor: ValueAccessor<T>;

  // optional properties
  @Input() width?: number;
  @Input() height?: number;
  @Input() dpi?: number;
  @Input() background?: string | LinearGradient | LinearGradientBuilder;
  @Input() margins?: Partial<Margins> | MarginsBuilder;
  @Input() strokeStyle?: string | LinearGradient | LinearGradientBuilder;
  @Input() fillStyle?: string | LinearGradient | LinearGradientBuilder;
  @Input() lineDash?: number[];
  @Input() lineWidth?: number;
  @Input() xDomain?: Range;
  @Input() yDomain?: Range;
  @Input() xDatumLines?: DatumLine[];
  @Input() yDatumLines?: DatumLine[];
  @Input() properties?: LineChartProperties;
  @Input() mouseEventTypes?: MouseEventType[];

  @Output() mouseEvent = new EventEmitter<ChartMouseEvent>();

  @ViewChild('canvasRef') canvasRef!: ElementRef<HTMLCanvasElement>;

  lineChart?: LineChart<T>;

  ngAfterViewInit(): void {
    this.lineChart = lineChart<T>(this.properties);
    this.#setChartProperties(this.lineChart);
    this.lineChart.render(this.values, this.canvasRef.nativeElement);
  }

  ngOnDestroy() {
    this.lineChart?.dispose();
  }

  onMouseEvent(chartMouseEvent: ChartMouseEvent) {
    this.mouseEvent.emit(chartMouseEvent);
  }

  #setChartProperties(chart: LineChart<T>) {
    const inputMappings = this.#getInputToChartMappings(chart);

    Object.entries(inputMappings).forEach(([key, method]) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const value = (this as any)[key];
      if (value !== undefined && method) {
        method.call(chart, value);
      }
    });

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
    chart: LineChart<T>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Record<string, (arg: any) => LineChart<T>> {
    return {
      width: chart.width,
      height: chart.height,
      dpi: chart.dpi,
      margins: chart.margins,
      background: chart.background,
      strokeStyle: chart.strokeStyle,
      fillStyle: chart.fillStyle,
      lineDash: chart.lineDash,
      lineWidth: chart.lineWidth,
      xDomain: chart.xDomain,
      yDomain: chart.yDomain,
      xDatumLines: chart.xDatumLines,
      yDatumLines: chart.yDatumLines,
      xAccessor: chart.xAccessor,
      yAccessor: chart.yAccessor,
    };
  }
}
