import { Routes } from '@angular/router';

// Each page is lazy-loaded, so its code is only downloaded when the route is visited.
export const routes: Routes = [
  {
    path: '',
    title: 'Weatherwise',
    loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'weather/:city',
    title: 'Forecast | Weatherwise',
    loadComponent: () =>
      import('./pages/weather-detail/weather-detail.component').then((m) => m.WeatherDetailComponent),
  },
  {
    path: 'about',
    title: 'About | Weatherwise',
    loadComponent: () => import('./pages/about/about.component').then((m) => m.AboutComponent),
  },
  {
    path: '**',
    title: 'Page not found | Weatherwise',
    loadComponent: () =>
      import('./pages/not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
];
