import { Units } from '../models/weather.model';

export interface UnitLabels {
  temp: string;
  wind: string;
  rain: string;
}

export function unitLabels(units: Units): UnitLabels {
  return units === 'imperial'
    ? { temp: '°F', wind: 'mph', rain: 'in' }
    : { temp: '°C', wind: 'km/h', rain: 'mm' };
}
