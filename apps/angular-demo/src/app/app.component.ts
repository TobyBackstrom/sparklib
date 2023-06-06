import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LineChartComponent } from 'ngx-sparklib';

import {
  singleValues,
  dateDataValues,
  monoDataValues,
  pairDataValues,
  pairSegmentValues,
} from './data';
import { lineChart } from 'sparklib';

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

    this.#append(chart0, 'chart0');
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