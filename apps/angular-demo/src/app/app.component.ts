import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { WeatherRecord, WeatherService } from './weather.service';

import {
  datumLine,
  lineChart,
  lineProperties,
  linearGradient,
  margins,
  stripeChart,
  LineChartComponent,
  StripeChartComponent,
} from 'ngx-sparklib';

import {
  monoDataValues,
  monotonicIncreasing,
  pairDataValues,
  pairSegmentValues,
  randomInRange,
  singleValues,
  stripe_x10_0_and_1,
  stripe_x10_0_to_9,
  stripe_x10_1_and_0,
  stripe_x10_mostly_0,
  stripe_x10_mostly_1,
} from './data';
import { CommonModule } from '@angular/common';

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

  monoDataValues = monoDataValues;
  pairDataValues = pairDataValues;
  pairSegmentValues = pairSegmentValues;
  stripe_x10_1_and_0 = stripe_x10_1_and_0;
  stripe_x10_0_and_1 = stripe_x10_0_and_1;
  stripe_x10_mostly_0 = stripe_x10_mostly_0;
  stripe_x10_mostly_1 = stripe_x10_mostly_1;
  stripe_x10_0_to_9 = stripe_x10_0_to_9;

  marginsBuilder = margins().bottom(25).left(25).right(25).top(25);
  margins = margins().bottom(5).left(5).right(5).top(5).build();

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

  ngOnInit(): void {
    this.weatherService.getWeatherRecords().subscribe({
      next: (data: WeatherRecord[]) => {
        this.weatherRecords = data;
      },
      error: (e) => console.error('Error fetching weather records:', e),
    });
  }

  ngAfterViewInit(): void {
    const chart0 = lineChart()
      .width(150)
      .height(250)
      .margins({ bottom: 0, left: 0, right: 0, top: 0 })
      .yDatum(0, { lineDash: [1, 1], strokeStyle: 'gray' })
      .yDatum(5)
      .yDatum(-5)
      .yDomain([-10, 10])
      .render(singleValues);

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

    this.#append(chart0, 'chart0');
    this.#append(chart1, 'chart1');
    this.#append(chart2, 'chart2');
  }

  constructor(private weatherService: WeatherService) {}

  convert(data: any): [number, number][] {
    return data.map((value: any, index: any) => [index, value]);
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
}
