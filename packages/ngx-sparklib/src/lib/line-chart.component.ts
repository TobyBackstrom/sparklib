import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ChartMargins,
  DatumLine,
  LinearGradient,
  LineChart,
  lineChart,
  LineChartProperties,
  Range,
} from 'sparklib';

@Component({
  selector: 'sparklib-line-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
})
export class LineChartComponent implements AfterViewInit {
  // mandatory properties
  @Input({ required: true }) values!: (number | [number, number])[];
  // optional properties
  @Input() width?: number;
  @Input() height?: number;
  @Input() dpi?: number;
  @Input() background?: string;
  @Input() margins?: Partial<ChartMargins>;
  @Input() strokeStyle?: string | LinearGradient;
  @Input() fillStyle?: string | LinearGradient;
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  #getInputToChartMappings(
    chart: LineChart
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
