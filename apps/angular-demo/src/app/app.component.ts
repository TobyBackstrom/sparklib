import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  WeatherRecord,
  WeatherRecordSet,
  WeatherService,
} from './weather.service';

import {
  datumLine,
  getIndicesForPixelX,
  lineChart,
  lineProperties,
  linearGradient,
  margins,
  stripeChart,
  LineChartComponent,
  StripeChartComponent,
} from 'ngx-sparklib';

import {
  DataObject,
  monoDataValues,
  monoDataValuesWithGaps,
  monoObjectValuesWithGaps,
  monotonicIncreasing,
  pairDataValues,
  pairSegmentValues,
  pairObjectSegmentValues,
  randomInRange,
  singleValues,
  stripe_x10_0_and_1,
  stripe_x10_0_to_9,
  stripe_x10_1_and_0,
  stripe_x10_mostly_0,
  stripe_x10_mostly_1,
  randomObjectsInRange,
  StripeDataObject,
} from './data';
import { CommonModule } from '@angular/common';
import {
  AxisTick,
  ChartMouseEvent,
  LineChart,
  MouseEventType,
  axisBottom,
  axisLeft,
  axisRight,
  axisTop,
} from 'sparklib';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    LineChartComponent,
    StripeChartComponent,
    RouterModule,
  ],
  selector: 'sparklib-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit, OnInit {
  @ViewChild('container') container: ElementRef<HTMLDivElement> | undefined;

  weatherRecords: WeatherRecord[] = [];
  credits = '';
  lineChartHeight = 40;

  monoDataValues = monoDataValues;
  monoDataValuesWithGaps = monoDataValuesWithGaps;
  monoObjectValuesWithGaps = monoObjectValuesWithGaps;
  pairDataValues = pairDataValues;
  pairSegmentValues = pairSegmentValues;
  pairObjectSegmentValues = pairObjectSegmentValues;
  stripe_x10_1_and_0 = stripe_x10_1_and_0;
  stripe_x10_0_and_1 = stripe_x10_0_and_1;
  stripe_x10_mostly_0 = stripe_x10_mostly_0;
  stripe_x10_mostly_1 = stripe_x10_mostly_1;
  stripe_x10_0_to_9 = stripe_x10_0_to_9;

  marginsBuilder = margins().bottom(25).left(25).right(25).top(25);
  margins = margins().bottom(5).left(5).right(5).top(5).build();

  yDatumLines = [
    datumLine(
      0,
      lineProperties()
        .setLineDash([4, 2])
        .setLineWidth(1)
        .setStrokeStyle('darkgray'),
    ).build(),
  ];

  temperatureColors: string[] = [
    '#67001f',
    '#b2182b',
    '#d6604d',
    '#f4a582',
    '#fddbc7',
    '#f7f7f7',
    '#d1e5f0',
    '#92c5de',
    '#4393c3',
    '#2166ac',
    '#053061',
  ];

  prideColors: string[] = [
    '#ed2224',
    '#f35b22',
    '#f99621',
    '#f5c11e',
    '#f1eb1b',
    '#f1eb1b',
    '#f1eb1b',
    '#63c720',
    '#0c9b49',
    '#21878d',
    '#3954a5',
    '#61379b',
    '#93288e',
  ];

  redColors = [
    '#ffffff',
    '#fff5f0',
    '#fee0d2',
    '#fcbba1',
    '#fc9272',
    '#fb6a4a',
    '#ef3b2c',
    '#cb181d',
    // '#a50f15',
    // '#67000d',
  ];

  prideGradient = linearGradient(0, 0, 250, 0)
    .addColorStop(0.077, '#ed2224')
    .addColorStop(0.154, '#f35b22')
    .addColorStop(0.231, '#f99621')
    .addColorStop(0.308, '#f5c11e')
    .addColorStop(0.385, '#f1eb1b')
    .addColorStop(0.462, '#f1eb1b')
    .addColorStop(0.539, '#f1eb1b')
    .addColorStop(0.616, '#63c720')
    .addColorStop(0.693, '#0c9b49')
    .addColorStop(0.77, '#21878d')
    .addColorStop(0.847, '#3954a5')
    .addColorStop(0.924, '#61379b')
    .addColorStop(1, '#93288e');

  simpleTemperatureGradient = linearGradient(0, 0, 0, this.lineChartHeight)
    .addColorStop(0.0, '#67001f')
    .addColorStop(0.1, '#b2182b')
    .addColorStop(0.2, '#d6604d')
    .addColorStop(0.3, '#f4a582')
    .addColorStop(0.4, '#fddbc7')
    .addColorStop(0.5, '#f7f7f7')
    .addColorStop(0.6, '#d1e5f0')
    .addColorStop(0.7, '#92c5de')
    .addColorStop(0.8, '#4393c3')
    .addColorStop(0.9, '#2166ac')
    .addColorStop(1.0, '#053061');

  hGradientBuilder = linearGradient(0, 0, 250, 0)
    .addColorStop(0, 'blue')
    .addColorStop(1, 'lightgreen');

  hGradient = linearGradient(0, 0, 250, 0)
    .addColorStop(0, 'lightgreen')
    .addColorStop(1, 'black')
    .build();

  vGradient = linearGradient(0, 0, 0, 50)
    .addColorStop(0, 'yellow')
    .addColorStop(1, 'red');

  lineChart0: LineChart | null = null;

  xAccessor = (data: DataObject): number | null => data.xPos;
  yAccessor = (data: DataObject): number | null => data.yPos;

  MouseEventType = MouseEventType; // Expose the enum to the template

  ngOnInit(): void {
    this.weatherService.getWeatherRecords().subscribe({
      next: (data: WeatherRecordSet) => {
        this.weatherRecords = data.weatherRecords;
        this.credits = data.credits;
        this.#addMoreExamples();
        this.#addMoreStripeCharts();
        this.#addAxis();
      },
      error: (e) => console.error('Error fetching weather records:', e),
    });
  }

  ngAfterViewInit(): void {
    this.lineChart0 = lineChart()
      .width(150)
      .height(250)
      .margins({ bottom: 0, left: 0, right: 0, top: 0 })
      .yDatum(0, { lineDash: [1, 1], strokeStyle: 'gray' })
      .yDatum(5)
      .yDatum(-5)
      .yDomain([-10, 10]);
    const chart0 = this.lineChart0.render(singleValues);
    //this.#mouseOverChart(this.lineChart0, chart0);

    const chart1 = lineChart()
      .width(150)
      .height(250)
      .margins(margins().bottom(10).left(10).right(10).top(10))
      .yDatum(0, { lineDash: [1, 1], strokeStyle: 'gray' })
      .yDatum(5)
      .yDatum(-5)
      .yDomain([-10, 10])
      .render(singleValues);

    const chart2 = lineChart()
      .width(150)
      .height(250)
      .margins(margins().bottom(10).left(10).right(10).top(10))
      .xDatum(
        datumLine(
          10,
          lineProperties()
            .setLineDash([2, 2])
            .setStrokeStyle(
              linearGradient(10, 0, 10, 250)
                .addColorStop(0, 'blue')
                .addColorStop(1, 'lightgreen'),
            ),
        ),
      )
      .yDatum(
        datumLine(
          0,
          lineProperties()
            .setLineDash([1, 1])
            .setLineWidth(1)
            .setStrokeStyle('gray'),
        ),
      )
      .yDatum(5)
      .yDatum(-5)
      .yDomain([-10, 10])
      .render(singleValues);

    const chart2b = lineChart()
      .width(150)
      .height(150)
      .margins(margins().bottom(10).left(10).right(10).top(10))
      .xDatum(
        datumLine(
          10,
          lineProperties()
            .setLineDash([2, 2])
            .setStrokeStyle(
              linearGradient(10, 0, 10, 250)
                .addColorStop(0, 'blue')
                .addColorStop(1, 'lightgreen'),
            ),
        ),
      )
      .yDatum(
        datumLine(
          0,
          lineProperties()
            .setLineDash([1, 1])
            .setLineWidth(1)
            .setStrokeStyle('gray'),
        ),
      )
      .yDatum(5)
      .yDatum(-5)
      .yDomain([-10, 10])
      .fillStyle('lightgreen')
      .render(singleValues);

    const chart2c = lineChart()
      .width(150)
      .height(150)
      .margins(margins().bottom(10).left(10).right(10).top(10))
      .xDatum(
        datumLine(
          10,
          lineProperties()
            .setLineDash([2, 2])
            .setStrokeStyle(
              linearGradient(10, 0, 10, 250)
                .addColorStop(0, 'blue')
                .addColorStop(1, 'lightgreen'),
            ),
          0,
        ),
      )
      .yDatum(
        datumLine(
          0,
          lineProperties()
            .setLineDash([1, 1])
            .setLineWidth(1)
            .setStrokeStyle('gray'),
          0,
        ),
      )
      .yDatum(5, undefined, 0)
      .yDatum(-5, undefined, 0)
      .yDomain([-10, 10])
      .fillStyle('lightgreen')
      .render(singleValues);

    const stripeChart0 = stripeChart()
      .width(stripe_x10_1_and_0.length * 4)
      .height(25)
      .render(stripe_x10_1_and_0);

    const stripeChart1 = stripeChart()
      .width(stripe_x10_mostly_0.length * 4)
      .height(25)
      .render(stripe_x10_mostly_0);

    const stripeChart2 = stripeChart()
      .width(stripe_x10_0_and_1.length * 4)
      .height(25)
      .render(stripe_x10_0_and_1);

    const stripeChart3a = stripeChart()
      .width(stripe_x10_mostly_1.length * 4)
      .height(25)
      .render(stripe_x10_mostly_1);

    const stripeChart3b = stripeChart()
      .width(stripe_x10_0_to_9.length * 4)
      .height(25)
      .render(stripe_x10_0_to_9);

    const monotonic100 = monotonicIncreasing(0, 100);
    const monotonicDay = monotonicIncreasing(0, 24 * 60);
    const randomDay1 = randomInRange(0, 5, 24 * 60, 0);
    const randomDay2 = randomInRange(0, 5, 24 * 60, 0.8);
    const randomObjectsDay2 = randomObjectsInRange(0, 5, 24 * 60, 0.8);

    const stripeChart4 = stripeChart()
      .width(monotonic100.length * 2)
      .height(25)
      .gradientColors(['red', 'green', 'blue'])
      .nGradientColorLevels(3)
      .render(monotonic100);

    const stripeChart5 = stripeChart()
      .width(monotonicDay.length)
      .height(25)
      .gradientColors(['red', 'green', 'blue'])
      .render(monotonicDay);

    const stripeChart6 = stripeChart()
      .width(monotonicDay.length)
      .height(25)
      .gradientColors(this.prideColors, monotonicDay.length)
      .render(monotonicDay);

    const stripeChart7 = stripeChart()
      .width(monotonicDay.length)
      .height(25)
      .gradientColors(this.prideColors, 40)
      .render(monotonicDay);

    const stripeChart8a = stripeChart()
      .width(randomDay1.length)
      .height(25)
      .gradientColors(this.prideColors)
      .render(randomDay1);

    const stripeChart8b = stripeChart()
      .width(randomDay1.length / 4)
      .height(25)
      .gradientColors(this.prideColors)
      .render(randomDay1);

    const stripeChart9a = stripeChart()
      .width(randomDay2.length)
      .height(25)
      .gradientColors(this.redColors, this.redColors.length)
      .render(randomDay2);

    const stripeChart9b = stripeChart()
      .width(randomDay2.length / 4)
      .height(25)
      .gradientColors(this.redColors, this.redColors.length)
      .render(randomDay2);

    const stripeChart9c = stripeChart<StripeDataObject>()
      .width(randomObjectsDay2.length)
      .height(25)
      .gradientColors(this.redColors, this.redColors.length)
      .valueAccessor((data: StripeDataObject): number => data.value)
      .render(randomObjectsDay2);

    const stripeChart9d = stripeChart<StripeDataObject>()
      .width(randomObjectsDay2.length / 4)
      .height(25)
      .gradientColors(this.redColors, this.redColors.length)
      .valueAccessor((data: StripeDataObject): number => data.value)
      .render(randomObjectsDay2);

    this.#append(stripeChart0, 'stripeChart0', true);
    this.#append(stripeChart1, 'stripeChart1', true);
    this.#append(stripeChart2, 'stripeChart2', true);
    this.#append(stripeChart3a, 'stripeChart3a', true);
    this.#append(stripeChart3b, 'stripeChart3b', true);
    this.#append(stripeChart4, 'stripeChart4');
    this.#append(stripeChart5, 'stripeChart5');
    this.#append(stripeChart6, 'stripeChart6');
    this.#append(stripeChart7, 'stripeChart7');
    this.#append(stripeChart8a, 'stripeChart8a');
    this.#append(stripeChart8b, 'stripeChart8b');
    this.#append(stripeChart9a, 'stripeChart9a');
    this.#append(stripeChart9b, 'stripeChart9b');
    this.#append(stripeChart9c, 'stripeChart9c objects');
    this.#append(stripeChart9d, 'stripeChart9d objects');

    this.#append(chart0, 'chart0');
    this.#append(chart1, 'chart1');
    this.#append(chart2, 'chart2');
    this.#append(chart2b, 'chart2b');
    this.#append(chart2c, 'chart2c');

    const barcodeData = this.#generateBarcode();

    const barcodeStripeChart = stripeChart()
      .width(barcodeData.length * 2)
      .height(40)
      .render(barcodeData);

    this.#append(barcodeStripeChart, 'barcodeStripeChart');
  }

  constructor(private weatherService: WeatherService) {}

  handleMouseEvent(event: ChartMouseEvent, rowIndex: number) {
    const record = this.weatherRecords[rowIndex];

    if (event.x >= 0) {
      const value = record.maxT[event.startIndex];
      console.log(
        `${event.eventType} [${rowIndex}:${event.startIndex}/${event.endIndex}]: (${event.x},${event.y}) = ${value}`,
        event,
      );
    }
  }

  handleStripeChartMouseEvent(event: ChartMouseEvent) {
    console.log(
      `${event.eventType} [${event.startIndex}/${event.endIndex}]: (${event.x},${event.y})`,
      event,
    );
  }

  // used for the docs
  #addMoreExamples() {
    const data: number[] = [16, 15.1, 10, 14.2 /* and so on...*/];

    const chart = lineChart()
      .width(data.length)
      .height(40)
      .background('lightyellow')
      .fillStyle(
        linearGradient(0, 0, data.length, 0)
          .addColorStop(0, 'lightgreen')
          .addColorStop(1, 'black'),
      )
      .yDomain([0, 45])
      .render(data);

    this.#append(chart, 'exampleChart0');

    const record = this.weatherRecords[0];

    const mouseOverChart0 = lineChart()
      .width(record.maxT.length / 2)
      .height(40)
      .background('lightyellow')
      .yDomain([-15, 45])
      .render(record.maxT);
    mouseOverChart0.addEventListener('mousemove', (event) => {
      const rect = mouseOverChart0.getBoundingClientRect();
      const x = Math.floor(event.clientX - rect.left);
      if (x >= 0 && x < mouseOverChart0.width) {
        const idx = getIndicesForPixelX(
          x,
          record.maxT.length / 2,
          record.maxT.length,
        );
        const value = record.maxT[idx.startIndex];
        console.log(
          `${value}: ${x}/${mouseOverChart0.width} [${idx.startIndex}->${idx.endIndex}=${idx.startIndex}] (${event.clientX},${event.clientY})`,
        );
      }
    });
    this.#append(mouseOverChart0, 'mouseOverChart0');

    const mouseOverChart1 = lineChart()
      .width(record.maxT.length)
      .height(40)
      .background('lightyellow')
      .yDomain([-15, 45])
      .render(record.maxT);
    mouseOverChart1.addEventListener('mousemove', (event) => {
      const rect = mouseOverChart1.getBoundingClientRect();
      const x = Math.floor(event.clientX - rect.left);
      if (x >= 0 && x < mouseOverChart1.width) {
        const idx = getIndicesForPixelX(
          x,
          record.maxT.length,
          record.maxT.length,
        );
        const value = record.maxT[idx.startIndex];
        console.log(
          `${value}: ${x}/${mouseOverChart1.width} [${idx.startIndex}->${idx.endIndex}=${idx.startIndex}] (${event.clientX},${event.clientY})`,
        );
      }
    });
    this.#append(mouseOverChart1, 'mouseOverChart1');

    const mouseOverChart2 = lineChart()
      .width(record.maxT.length * 2)
      .height(40)
      .background('lightyellow')
      .yDomain([-15, 45])
      .mouseEventListener(MouseEventType.MouseMove, (chartMouseEvent) => {
        console.log(
          `${chartMouseEvent.mouseEvent.timeStamp} ${JSON.stringify(
            chartMouseEvent,
          )}`,
        );
      })
      .render(record.maxT);

    this.#append(mouseOverChart2, 'mouseOverChart2');
  }

  #addMoreStripeCharts() {
    const random250_1 = randomInRange(0, 5, 250, 0);
    const random250_2 = randomInRange(0, 5, 250, 0.8);
    const monotonic250 = monotonicIncreasing(0, 250);

    const scPride1_a = stripeChart()
      .width(monotonic250.length)
      .height(25)
      .gradientColors(this.prideColors, monotonic250.length)
      .render(monotonic250);

    const scPride1_b = stripeChart()
      .width(monotonic250.length)
      .height(25)
      .gradientColors(this.prideColors, 10)
      .render(monotonic250);

    const scPride2 = stripeChart()
      .width(random250_1.length)
      .height(25)
      .gradientColors(this.prideColors, random250_1.length)
      .render(random250_1);

    const gradient = ['white', 'red'];

    const sc2 = stripeChart()
      .width(random250_2.length)
      .height(25)
      .gradientColors(gradient, gradient.length)
      .mouseEventListener(MouseEventType.MouseMove, (chartMouseEvent) => {
        console.log(
          `random250_2: ${
            chartMouseEvent.mouseEvent.timeStamp
          } ${JSON.stringify(chartMouseEvent)}`,
        );
      })
      .render(random250_2);

    this.#append(scPride1_a, 'monotonic250');
    this.#append(scPride1_b, 'monotonic250 bin');
    this.#append(scPride2, 'random250_1');
    this.#append(sc2, 'random250_2');
  }

  #addAxis() {
    const ticks0: AxisTick[] = [
      { label: '0', position: 0 },
      { label: '', position: 62 },
      { label: '125', position: 125 },
      { label: '', position: 188 },
      { label: '250', position: 250 },
    ];

    const ticks1: AxisTick[] = [
      { label: '25', position: 25 },
      { label: '', position: 75 },
      { label: '125', position: 125 },
      { label: '', position: 175 },
      { label: '225', position: 225 },
    ];

    const a0 = axisTop()
      .width(250)
      .height(30)
      // .background('pink')
      .lineWidth(2)
      .font('11px arial')
      .fontColor('blue')
      .ticks(ticks0)
      .tickPadding(4)
      .tickLength(15)
      .tickWidth(1)
      .render();
    this.#append(a0, 'axisTop');

    const a1 = axisBottom()
      .width(250)
      .height(30)
      // .background('pink')
      .lineWidth(3)
      .font('16px arial')
      .ticks(ticks1)
      .render();
    this.#append(a1, 'axisBottom');

    const a2 = axisLeft()
      .width(40)
      .height(250)
      // .background('pink')
      .lineWidth(3)
      .font('bold 11px arial')
      .fontColor('blue')
      .ticks(ticks0)
      .render();
    this.#append(a2, 'axisLeft');

    const a3 = axisRight()
      .width(40)
      .height(250)
      // .background('pink')
      .lineWidth(1)
      .ticks(ticks1)
      .render();
    this.#append(a3, 'axisRight');
  }

  #append(chart: HTMLCanvasElement, label: string, border = true) {
    const div = document.createElement('div');
    div.textContent = label;
    this.container?.nativeElement.appendChild(div);

    this.container?.nativeElement.appendChild(chart);

    if (border) {
      chart.style.borderWidth = '1px';
      chart.style.borderStyle = 'solid';
      chart.style.borderColor = 'lightgray';
      chart.style.margin = '4px';
    }

    this.container?.nativeElement.appendChild(chart);
  }

  #generateBarcode(): number[] {
    const characters = new Map([
      ['*', '100101101101'],
      ['A', '110101001011'],
      ['B', '101101001011'],
      ['I', '101101001101'],
      ['K', '110101010011'],
      ['L', '101101010011'],
      ['P', '101101101001'],
      ['R', '110101011001'],
      ['S', '101101011001'],
    ]);

    const encodedString = Array.from('*SPARKLIB*')
      .map((char) => characters.get(char) + '0') // Code 39 barcodes have a "space" between each "character".
      .join('')
      .slice(0, -1);

    return Array.from(encodedString).map(Number);
  }

  _barcodeData = [
    1, 0, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1,
    0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1,
    1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0,
    1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1,
    1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0,
    1, 1, 0, 1,
  ];

  _random250_1 = [
    3, 2, 2.5, 3, 4.5, 1, 0.5, 0, 1, 2, 4.5, 3.5, 4, 0.5, 0, 1.5, 3, 4.5, 0, 4,
    2.5, 3, 4.5, 0.5, 3, 4, 1.5, 0.5, 1, 3.5, 4.5, 1.5, 2, 1, 4.5, 2.5, 3.5, 4,
    0, 1.5, 0.5, 3, 2.5, 4, 2.5, 0.5, 2, 1.5, 4.5, 2, 2, 3, 5, 3.5, 2.5, 2.5, 3,
    1.5, 0, 4.5, 3, 0.5, 3, 5, 2.5, 3.5, 4, 1, 2.5, 3.5, 1, 0, 3.5, 4, 0.5, 1,
    4.5, 0, 3, 1, 3, 5, 4.5, 1.5, 1.5, 3.5, 1, 0.5, 1.5, 0, 1, 4, 4.5, 1, 3,
    3.5, 4.5, 4, 4.5, 4.5, 3, 4, 1.5, 1.5, 0.5, 1.5, 2.5, 2.5, 2.5, 1.5, 4, 1,
    4.5, 3, 3, 0.5, 2, 5, 3.5, 2, 2, 4, 1.5, 2.5, 2.5, 3, 0.5, 1.5, 3, 2, 1, 4,
    1, 4, 1.5, 3.5, 3.5, 0, 4, 0.5, 2.5, 2.5, 2.5, 4, 2, 1.5, 3.5, 3, 4, 1.5, 4,
    0, 1, 2.5, 4.5, 2, 0, 2, 1, 3, 4.5, 0.5, 4.5, 0, 3.5, 2.5, 2.5, 4.5, 3.5,
    4.5, 1, 1.5, 4, 1, 0.5, 2, 2, 4, 3.5, 2, 5, 4, 3.5, 4, 3, 4.5, 3.5, 3.5,
    2.5, 3.5, 0.5, 1, 0.5, 2, 1.5, 0.5, 1, 3.5, 3, 0.5, 0.5, 3, 3.5, 2, 3.5, 0,
    3, 3.5, 2, 2.5, 3, 4.5, 3, 0, 2.5, 2.5, 3.5, 1, 0.5, 2, 3, 1.5, 3.5, 1.5,
    1.5, 1.5, 3.5, 5, 3.5, 3, 4.5, 4, 2.5, 3, 3, 1.5, 0, 2, 1.5, 4, 5, 4, 5,
    2.5, 1, 0.5, 0, 2, 0.5, 4.5,
  ];
  _random250_2 = [
    0, 4.5, 0, 0, 0, 0, 0, 0, 4, 0, 0, 5, 0, 0, 0, 5, 0, 4, 0, 0, 0, 0, 0, 4.5,
    5, 0, 4.5, 0, 0, 0, 0, 0, 0, 0, 0, 4.5, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4.5, 0, 4.5, 4.5, 4, 0, 0, 0, 0, 0,
    0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 5, 0, 4, 4.5, 0, 0, 0, 0, 0, 0, 5,
    0, 4.5, 4.5, 5, 4, 0, 0, 0, 4.5, 5, 0, 4, 0, 0, 0, 0, 0, 4, 0, 4.5, 0, 4, 0,
    0, 0, 4, 0, 0, 0, 0, 4.5, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 4.5, 0,
    0, 0, 0, 4.5, 0, 4.5, 0, 5, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 4.5, 0, 0, 0, 0,
    5, 0, 0, 5, 4, 5, 0, 0, 0, 5, 0, 0, 4.5, 0, 0, 0, 0, 0, 4.5, 0, 0, 4.5, 0,
    4.5, 0, 0, 0, 4.5, 0, 0, 4, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 5, 0, 0, 4.5, 4.5,
    0, 0, 4, 0, 4, 5, 0, 0, 4.5, 4, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 4.5, 5, 0,
    0, 0, 0, 4.5, 4, 0, 0, 0, 4.5, 0, 0, 4.5, 0, 0,
  ];
  _monotonic250 = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
    40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58,
    59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77,
    78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96,
    97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112,
    113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127,
    128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142,
    143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157,
    158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172,
    173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187,
    188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202,
    203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217,
    218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232,
    233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247,
    248, 249,
  ];
}
