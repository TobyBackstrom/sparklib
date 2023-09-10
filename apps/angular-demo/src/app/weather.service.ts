import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type WeatherRecordSet = {
  credits: string;
  weatherRecords: WeatherRecord[];
};

export type WeatherRecord = {
  stationNumber: string;
  region?: string;
  country: string;
  state?: string;
  city?: string;
  fromDate: string;
  toDate: string;
  maxT: (number | null)[];
  meanT: (number | null)[];
  minT: (number | null)[];
};

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  constructor(private http: HttpClient) {}

  getWeatherRecords(): Observable<WeatherRecordSet> {
    return this.http.get<WeatherRecordSet>('assets/weather-records.json');
  }
}
