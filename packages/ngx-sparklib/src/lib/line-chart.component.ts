import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartMargins, lineChart } from 'sparklib';

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
  @Input({ required: false }) width?: number;
  @Input({ required: false }) height?: number;
  @Input({ required: false }) background?: string;
  @Input({ required: false }) dpi?: number;
  @Input({ required: false }) margins?: Partial<ChartMargins>;
  @ViewChild('canvasRef') canvasRef!: ElementRef<HTMLCanvasElement>;

  //  constructor() {}

  ngAfterViewInit(): void {
    const chart = lineChart();

    if (this.width) {
      chart.width(this.width);
    }

    if (this.height) {
      chart.height(this.height);
    }

    if (this.margins) {
      // TODO: check if margins were actually set as they might be called with margins() to trigger a NO_MARGINS setting.
      chart.margins(this.margins);
    }

    if (this.background) {
      chart.background(this.background);
    }

    this.canvasRef.nativeElement.replaceWith(chart.render(this.values));
  }
}
