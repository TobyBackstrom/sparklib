import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Margins,
  DatumLine,
  LinearGradient,
  LineChart,
  lineChart,
  LineChartProperties,
  Range,
  LinearGradientBuilder,
  MarginsBuilder,
} from 'sparklib';

@Component({
  selector: 'sparklib-line-chart',
  standalone: true,
  imports: [CommonModule],
  template: '<canvas #canvasRef></canvas>',
  styles: [],
})
export class LineChartComponent implements AfterViewInit {
  // mandatory properties
  @Input({ required: true }) values!: (number | [number, number])[];
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

  @ViewChild('canvasRef') canvasRef!: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit(): void {
    const chart = lineChart(this.properties);
    this.#setChartProperties(chart);
    this.canvasRef.nativeElement.replaceWith(chart.render(this.values));
  }

  #setChartProperties(chart: LineChart) {
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
    chart: LineChart,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Record<string, (arg: any) => LineChart> {
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
    };
  }
}
