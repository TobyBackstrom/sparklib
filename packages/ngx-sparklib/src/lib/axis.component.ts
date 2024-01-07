import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Axis,
  AxisChartProperties,
  AxisPosition,
  AxisTick,
  LinearGradient,
  LinearGradientBuilder,
  axis,
} from 'sparklib';

@Component({
  selector: 'sparklib-axis',
  standalone: true,
  imports: [CommonModule],
  template: '<canvas #canvasRef></canvas>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AxisComponent implements AfterViewInit {
  @Input() width?: number;
  @Input() height?: number;
  @Input() dpi?: number;
  @Input() background?: string | LinearGradient | LinearGradientBuilder;
  @Input() position?: AxisPosition;
  @Input() font?: string;
  @Input() fontColor?: string;
  @Input() lineWidth?: number;
  @Input() ticks?: AxisTick[];
  @Input() tickLength?: number;
  @Input() tickWidth?: number;
  @Input() tickPadding?: number;
  @Input() properties?: AxisChartProperties;

  @ViewChild('canvasRef') canvasRef!: ElementRef<HTMLCanvasElement>;

  axis?: Axis;

  ngAfterViewInit(): void {
    this.axis = axis(this.properties);
    this.#setProperties(this.axis);
    this.axis.render(this.canvasRef.nativeElement);
  }

  #setProperties(axis: Axis) {
    const inputMappings = this.#getInputToChartMappings(axis);

    Object.entries(inputMappings).forEach(([key, method]) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const value = (this as any)[key];
      if (value !== undefined && method) {
        method.call(axis, value);
      }
    });
  }

  #getInputToChartMappings(
    chart: Axis,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Record<string, (arg: any) => Axis> {
    return {
      width: chart.width,
      height: chart.height,
      dpi: chart.dpi,
      background: chart.background,
      position: chart.position,
      font: chart.font,
      fontColor: chart.fontColor,
      lineWidth: chart.lineWidth,
      ticks: chart.ticks,
      tickLength: chart.tickLength,
      tickWidth: chart.tickWidth,
      tickPadding: chart.tickPadding,
    };
  }
}
