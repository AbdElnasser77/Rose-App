import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { BASE_URL_CONFIG } from '@org/auth';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    provideHttpClient(withFetch()),
    {
      provide: BASE_URL_CONFIG,
      useValue: {
        apiUrl: 'https://rose-app.elevate-bootcamp.cloud/api',
        production: false,
      },
    },
  ],
};
