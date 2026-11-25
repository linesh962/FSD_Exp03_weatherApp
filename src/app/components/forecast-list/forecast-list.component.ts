import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { DailyForecast, Units } from '../../models/weather.model';
import { unitLabels } from '../../utils/units';
import { describeWeather } from '../../utils/weather-codes';

@Component({
  selector: 'app-forecast-list',
  standalone: true,
  imports: [DatePipe, DecimalPipe],
  templateUrl: './forecast-list.component.html',
  styleUrl: './forecast-list.component.css',
})
export class ForecastListComponent {
  readonly days = input.required<DailyForecast[]>();
  readonly units = input.required<Units>();

  readonly labels = computed(() => unitLabels(this.units()));

  /** Each row's bar is positioned against the coldest and warmest values of the whole week. */
  readonly rows = computed(() => {
    const days = this.days();
    const weekMin = Math.min(...days.map((d) => d.tempMin));
    const weekMax = Math.max(...days.map((d) => d.tempMax));
    const span = Math.max(weekMax - weekMin, 1);

    return days.map((day, index) => {
      const { label, icon } = describeWeather(day.weatherCode);
      return {
        ...day,
        label,
        icon,
        isToday: index === 0,
        left: ((day.tempMin - weekMin) / span) * 100,
        width: Math.max(((day.tempMax - day.tempMin) / span) * 100, 4),
      };
    });
  });
}
