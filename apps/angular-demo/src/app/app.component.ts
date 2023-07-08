import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LineChartComponent } from 'ngx-sparklib';

import {
  datumLine,
  lineChart,
  lineProperties,
  linearGradient,
  margins,
  stripeChart,
} from 'sparklib';
import {
  monoDataValues,
  pairDataValues,
  pairSegmentValues,
  singleValues,
  stripe_x10_0_and_1,
  stripe_x10_1_and_0,
  stripe_x10_mostly_0,
  stripe_x10_mostly_1,
} from './data';

@Component({
  standalone: true,
  imports: [LineChartComponent, RouterModule],
  selector: 'sparklib-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  @ViewChild('container') container: ElementRef<HTMLDivElement> | undefined;

  monoDataValues = monoDataValues;
  pairDataValues = pairDataValues;
  pairSegmentValues = pairSegmentValues;

  marginsBuilder = margins().bottom(25).left(25).right(25).top(25);
  margins = margins().bottom(5).left(5).right(5).top(5).build();

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

    const stripeChart0 = stripeChart().width(10).render(stripe_x10_1_and_0);
    const stripeChart1 = stripeChart().width(10).render(stripe_x10_mostly_0);
    const stripeChart2 = stripeChart().width(10).render(stripe_x10_0_and_1);
    const stripeChart3 = stripeChart().width(10).render(stripe_x10_mostly_1);

    this.#append(chart0, 'chart0');
    this.#append(chart1, 'chart1');
    this.#append(chart2, 'chart2');

    this.#append(stripeChart0, 'stripeChart0');
    this.#append(stripeChart1, 'stripeChart1');
    this.#append(stripeChart2, 'stripeChart2');
    this.#append(stripeChart3, 'stripeChart3');
  }

  #append(chart: HTMLCanvasElement, label: string) {
    const div = document.createElement('div');
    div.textContent = label;
    this.container?.nativeElement.appendChild(div);

    this.container?.nativeElement.appendChild(chart);

    chart.style.borderWidth = '1px';
    chart.style.borderStyle = 'solid';
    chart.style.borderColor = 'lightgray';
    chart.style.margin = '4px';

    this.container?.nativeElement.appendChild(chart);
  }
}
