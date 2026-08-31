import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import {
  authInterceptor,
  BASE_URL_CONFIG,
  httpErrorInterceptor,
} from '@org/auth';
import { provideI18n } from '@rose/i18n';
import { appRoutes } from './app.routes';

/**
 * Only applied when the dashboard is served standalone on :4201. Loaded
 * through the shell, the remote inherits the shell's root providers instead
 * and none of this runs — mirrors how roseApp is set up.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      appRoutes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled',
      }),
    ),
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor, httpErrorInterceptor]),
    ),
    provideI18n(),
    {
      provide: BASE_URL_CONFIG,
      useValue: {
        apiUrl: 'https://rose-app.elevate-bootcamp.cloud/api',
        production: false,
      },
    },
  ],
};
