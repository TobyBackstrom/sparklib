import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  BarChart,
  BarChartProperties,
  BarValueType,
  DatumLine,
  LinearGradient,
  LinearGradientBuilder,
  Margins,
  MarginsBuilder,
  Range,
  ValueAccessor,
  barChart,
} from 'sparklib';

@Component({
  selector: 'sparklib-bar-chart',
  standalone: true,
  imports: [CommonModule],
  template:
    '<canvas #canvasRef [style.height.px]="height" style="display: block; margin: 0; padding: 0; border: none;"></canvas>',
  styles: [],
})
export class BarChartComponent<T = unknown>
  implements AfterViewInit, OnDestroy
{
  // mandatory properties
  @Input({ required: true }) values!: BarValueType<T>[];

  // optional value accessor
  @Input() valueAccessor: ValueAccessor<T>;

  // optional properties
  @Input() width?: number;
  @Input() height?: number;
  @Input() dpi?: number;
  @Input() background?: string | LinearGradient | LinearGradientBuilder;
  @Input() barPadding?: number;
  @Input() barWidth?: number;
  @Input() margins?: Partial<Margins> | MarginsBuilder;
  @Input() strokeStyle?: string | LinearGradient | LinearGradientBuilder;
  @Input() fillStyle?: string | LinearGradient | LinearGradientBuilder;
  @Input() yDomain?: Range;
  @Input() yDatumLines?: DatumLine[];
  @Input() properties?: BarChartProperties;

  @ViewChild('canvasRef') canvasRef!: ElementRef<HTMLCanvasElement>;

  barChart?: BarChart<T>;

  ngAfterViewInit(): void {
    this.barChart = barChart<T>(this.properties);
    this.#setChartProperties(this.barChart);
    this.barChart.render(this.values, this.canvasRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.barChart?.dispose();
  }

  #setChartProperties(chart: BarChart<T>) {
    const inputMappings = this.#getInputToChartMappings(chart);

    Object.entries(inputMappings).forEach(([key, method]) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const value = (this as any)[key];
      if (value !== undefined && method) {
        method.call(chart, value);
      }
    });
  }

  #getInputToChartMappings(
    chart: BarChart<T>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Record<string, (arg: any) => BarChart<T>> {
    return {
      // xAccessor: chart.xAccessor,
      // yAccessor: chart.yAccessor,
      // yDomain: chart.yDomain,
      background: chart.background,
      dpi: chart.dpi,
      fillStyle: chart.fillStyle,
      height: chart.height,
      margins: chart.margins,
      valueAccessor: chart.valueAccessor,
      width: chart.width,
      yDatumLines: chart.yDatumLines,
    };
  }
}
