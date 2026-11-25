import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { WeatherReport } from '../../models/weather.model';
import { unitLabels } from '../../utils/units';
import { describeWeather } from '../../utils/weather-codes';

@Component({
  selector: 'app-current-weather',
  standalone: true,
  imports: [DecimalPipe, DatePipe],
  templateUrl: './current-weather.component.html',
  styleUrl: './current-weather.component.css',
})
export class CurrentWeatherComponent {
  readonly report = input.required<WeatherReport>();

  readonly conditions = computed(() =>
    describeWeather(this.report().current.weatherCode, this.report().current.isDay),
  );
  readonly labels = computed(() => unitLabels(this.report().units));
}
