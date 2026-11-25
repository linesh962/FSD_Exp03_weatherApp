# Weatherwise (Angular weather app)

An Angular 18 app that shows current weather and a 7-day forecast for any city.
It uses standalone components, TypeScript, reactive forms and lazy-loaded routing.
Data comes from Open-Meteo, so no API key is needed.

## Run it

Requires Node.js 18.19+ (or 20+).

```bash
npm install
npm start
```

Then open http://localhost:4200.

## Where each requirement lives

| Concept | File |
| --- | --- |
| Routing | `src/app/app.routes.ts`, `src/app/app.config.ts` |
| Forms (reactive, with validation) | `src/app/pages/home/home.component.ts` |
| Route + query parameters | `src/app/pages/weather-detail/weather-detail.component.ts` |
| Components with signal inputs | `src/app/components/current-weather/`, `src/app/components/forecast-list/` |
| HTTP service | `src/app/services/weather.service.ts` |
| Typed models | `src/app/models/weather.model.ts` |

## Structure

```
src/
  index.html
  main.ts
  styles.css
  app/
    app.component.(ts|html|css)
    app.config.ts
    app.routes.ts
    models/weather.model.ts
    utils/weather-codes.ts, units.ts
    services/weather.service.ts, search-history.service.ts
    components/
      current-weather/  (ts, html, css)
      forecast-list/    (ts, html, css)
    pages/
      home/             (ts, html, css)
      weather-detail/   (ts, html, css)
      about/            (ts, html, css)
      not-found/        (ts, html, css)
```
