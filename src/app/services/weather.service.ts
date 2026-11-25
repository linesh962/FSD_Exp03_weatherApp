import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, switchMap } from 'rxjs';
import {
  ForecastApiResponse,
  GeoLocation,
  GeocodingApiResponse,
  Units,
  WeatherReport,
} from '../models/weather.model';

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private readonly http = inject(HttpClient);

  private readonly geocodingUrl = 'https://geocoding-api.open-meteo.com/v1/search';
  private readonly forecastUrl = 'https://api.open-meteo.com/v1/forecast';

  /** Looks up a city by name, then loads its current weather and 7-day forecast. */
  getWeather(city: string, units: Units): Observable<WeatherReport> {
    return this.geocode(city).pipe(switchMap((location) => this.forecast(location, units)));
  }

  private geocode(city: string): Observable<GeoLocation> {
    const params = new HttpParams()
      .set('name', city)
      .set('count', 1)
      .set('language', 'en')
      .set('format', 'json');

    return this.http.get<GeocodingApiResponse>(this.geocodingUrl, { params }).pipe(
      map((response) => {
        const match = response.results?.[0];
        if (!match) {
          throw new Error(`No city found called "${city}". Check the spelling and try again.`);
        }
        return {
          name: match.name,
          country: match.country,
          admin1: match.admin1,
          latitude: match.latitude,
          longitude: match.longitude,
        };
      }),
    );
  }

  private forecast(location: GeoLocation, units: Units): Observable<WeatherReport> {
    const imperial = units === 'imperial';
    const params = new HttpParams()
      .set('latitude', location.latitude)
      .set('longitude', location.longitude)
      .set(
        'current',
        'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m',
      )
      .set('daily', 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum')
      .set('forecast_days', 7)
      .set('timezone', 'auto')
      .set('temperature_unit', imperial ? 'fahrenheit' : 'celsius')
      .set('wind_speed_unit', imperial ? 'mph' : 'kmh')
      .set('precipitation_unit', imperial ? 'inch' : 'mm');

    return this.http.get<ForecastApiResponse>(this.forecastUrl, { params }).pipe(
      map((api) => ({
        location,
        units,
        current: {
          time: api.current.time,
          temperature: api.current.temperature_2m,
          feelsLike: api.current.apparent_temperature,
          humidity: api.current.relative_humidity_2m,
          windSpeed: api.current.wind_speed_10m,
          weatherCode: api.current.weather_code,
          isDay: api.current.is_day === 1,
        },
        daily: api.daily.time.map((date, i) => ({
          date,
          weatherCode: api.daily.weather_code[i],
          tempMax: api.daily.temperature_2m_max[i],
          tempMin: api.daily.temperature_2m_min[i],
          precipitation: api.daily.precipitation_sum[i],
        })),
      })),
    );
  }
}
