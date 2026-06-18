import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { BASE_URL_CONFIG, httpErrorInterceptor }from '@org/auth';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {authInterceptor} from '@org/auth';
import { SessionService } from '@org/auth';
import { provideI18n } from '@rose/i18n';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    provideAnimationsAsync(),
    provideHttpClient(),
    provideI18n(),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: '.dark',
          cssLayer: {
            name: 'primeng',
            order: 'base, primeng, utilities',
          },
        },
      },
    }),
    {
    provide: BASE_URL_CONFIG,
    useValue: {
      apiUrl: 'https://rose-app.elevate-bootcamp.cloud/api',
      production: false,
    },
    },
     provideHttpClient(
     withInterceptors([
     authInterceptor,
     httpErrorInterceptor,
    ])
     ),
     provideAppInitializer(() => {
      const sessionService = inject(SessionService);
      return sessionService.initSession();
    }),
  ],
};
