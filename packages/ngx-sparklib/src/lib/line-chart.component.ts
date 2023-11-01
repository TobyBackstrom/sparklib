import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  Renderer2,
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
  getIndicesForPixelX,
} from 'sparklib';

@Component({
  selector: 'sparklib-line-chart',
  standalone: true,
  imports: [CommonModule],
  template: '<canvas #canvasRef></canvas>',
  styles: [],
})
export class LineChartComponent implements AfterViewInit, OnDestroy {
  // mandatory properties
  @Input({ required: true }) values!: (
    | (number | null)
    | [number, number | null]
  )[];
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

  @Output() mouseMove = new EventEmitter<{
    x: number;
    y: number;
    startIndex: number;
    endIndex: number;
    mouseEvent: MouseEvent;
  }>();

  @ViewChild('canvasRef') canvasRef!: ElementRef<HTMLCanvasElement>;

  #unlisten?: () => void;
  #valueLength = 0;

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    const chart = lineChart(this.properties);
    this.#setChartProperties(chart);

    chart.render(this.values, this.canvasRef.nativeElement);

    // remember length of values at the time of rendering
    // this is needed when mapping mouse coordinates to domain coordinates
    this.#valueLength = this.values.length;

    this.#addMouseMoveListener();
  }

  ngOnDestroy() {
    this.#removeMouseMoveListener();
  }

  onMouseMove(event: MouseEvent) {
    // TODO: investigate why sometimes event.offsetX == -1 and x < 0.
    // TODO: automatically handle when the app is reloaded and the user has zoomed the browser viewport which means the dpi has changed
    // TODO: automatically handle when the canvas is moved to a display with a different dpi
    const element = this.canvasRef.nativeElement;

    const rect = element.getBoundingClientRect();

    let x = Math.round(event.clientX - rect.left);
    const y = Math.round(rect.bottom - event.clientY);

    // emit only if values are within bounds to avoid errors from rounding
    x = x < 0 ? 0 : x >= element.width ? element.width - 1 : x;

    const indices = getIndicesForPixelX(x, element.width, this.#valueLength);

    indices.endIndex =
      indices.endIndex < this.#valueLength
        ? indices.endIndex
        : this.#valueLength - 1;

    this.mouseMove.emit({
      x,
      y,
      startIndex: indices.startIndex,
      endIndex: indices.endIndex,
      mouseEvent: event,
    });
  }

  #addMouseMoveListener() {
    if (this.mouseMove.observed && !this.#unlisten) {
      this.#unlisten = this.renderer.listen(
        this.canvasRef.nativeElement,
        'mousemove',
        this.onMouseMove.bind(this),
      );
    }
  }
  #removeMouseMoveListener() {
    if (this.#unlisten) {
      this.#unlisten();
    }
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
