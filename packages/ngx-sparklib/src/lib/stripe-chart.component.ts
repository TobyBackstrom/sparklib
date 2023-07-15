import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LinearGradient,
  LinearGradientBuilder,
  Margins,
  MarginsBuilder,
  StripeChart,
  StripeChartProperties,
  stripeChart,
} from 'sparklib';

@Component({
  selector: 'sparklib-stripe-chart',
  standalone: true,
  imports: [CommonModule],
  template: '<canvas #canvasRef></canvas>',
  styles: [],
})
export class StripeChartComponent implements AfterViewInit {
  // mandatory properties
  @Input({ required: true }) values!: number[];
  // optional properties
  @Input() width?: number;
  @Input() height?: number;
  @Input() dpi?: number;
  @Input() background?: string | LinearGradient | LinearGradientBuilder;
  @Input() margins?: Partial<Margins> | MarginsBuilder;
  @Input() properties?: StripeChartProperties;

  @ViewChild('canvasRef') canvasRef!: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit(): void {
    const chart = stripeChart(this.properties);
    this.#setChartProperties(chart);
    this.canvasRef.nativeElement.replaceWith(chart.render(this.values));
  }

  #setChartProperties(chart: StripeChart) {
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
    chart: StripeChart,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Record<string, (arg: any) => StripeChart> {
    return {
      width: chart.width,
      height: chart.height,
      dpi: chart.dpi,
      margins: chart.margins,
      background: chart.background,
    };
  }
}
