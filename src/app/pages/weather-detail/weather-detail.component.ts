import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BehaviorSubject, catchError, combineLatest, of, switchMap, tap } from 'rxjs';
import { CurrentWeatherComponent } from '../../components/current-weather/current-weather.component';
import { ForecastListComponent } from '../../components/forecast-list/forecast-list.component';
import { Units, WeatherReport } from '../../models/weather.model';
import { SearchHistoryService } from '../../services/search-history.service';
import { WeatherService } from '../../services/weather.service';

@Component({
  selector: 'app-weather-detail',
  standalone: true,
  imports: [RouterLink, CurrentWeatherComponent, ForecastListComponent],
  templateUrl: './weather-detail.component.html',
  styleUrl: './weather-detail.component.css',
})
export class WeatherDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly weather = inject(WeatherService);
  private readonly history = inject(SearchHistoryService);
  private readonly reload$ = new BehaviorSubject<void>(undefined);

  readonly city = signal('');
  readonly report = signal<WeatherReport | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  constructor() {
    // Re-runs whenever the city (route param), the units (query param) or a retry changes.
    combineLatest([this.route.paramMap, this.route.queryParamMap, this.reload$])
      .pipe(
        tap(([params]) => {
          this.city.set(params.get('city') ?? '');
          this.loading.set(true);
          this.error.set(null);
        }),
        switchMap(([params, query]) => {
          const units: Units = query.get('units') === 'imperial' ? 'imperial' : 'metric';
          return this.weather.getWeather(params.get('city') ?? '', units).pipe(
            catchError((err: unknown) => {
              this.error.set(this.toMessage(err));
              return of(null);
            }),
          );
        }),
        takeUntilDestroyed(),
      )
      .subscribe((report) => {
        this.report.set(report);
        this.loading.set(false);
        if (report) {
          this.history.add(report.location.name);
        }
      });
  }

  retry(): void {
    this.reload$.next();
  }

  toggleUnits(): void {
    const next: Units = this.report()?.units === 'imperial' ? 'metric' : 'imperial';
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { units: next },
      queryParamsHandling: 'merge',
    });
  }

  private toMessage(err: unknown): string {
    if (err instanceof HttpErrorResponse) {
      return 'The weather service could not be reached. Check your connection and try again.';
    }
    if (err instanceof Error) {
      return err.message;
    }
    return 'Something went wrong. Try again.';
  }
}
