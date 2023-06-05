import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LineChartComponent } from 'ngx-sparklib';

import {
  singleValues,
  dateDataValues,
  monoDataValues,
  pairDataValues,
  pairSegmentValues,
} from './data';

@Component({
  standalone: true,
  imports: [LineChartComponent, RouterModule],
  selector: 'sparklib-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  monoDataValues = monoDataValues;
  pairDataValues = pairDataValues;
  pairSegmentValues = pairSegmentValues;
}
