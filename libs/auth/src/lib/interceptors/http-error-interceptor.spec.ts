import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ToastService } from '@org/shared-util-notification';

import { httpErrorInterceptor } from './http-error-interceptor';

describe('httpErrorInterceptor', () => {
  let httpTestingController: HttpTestingController;
  let navigatedTo: string | null;
  let toasts: string[];
  let router: { url: string; navigateByUrl: (url: string) => Promise<boolean> };

  const url = '/api/thing';

  /** Fires a request and fails it with the given status. */
  const failWith = (status: number) => {
    TestBed.inject(HttpClient)
      .get(url)
      .subscribe({ error: () => undefined });

    httpTestingController
      .expectOne(url)
      .flush('boom', { status, statusText: 'Error' });
  };

  /** `currentUrl` is what the router reports when the request fails. */
  const setup = (currentUrl: string) => {
    navigatedTo = null;
    toasts = [];

    router = {
      url: currentUrl,
      navigateByUrl: (target: string) => {
        navigatedTo = target;
        return Promise.resolve(true);
      },
    };

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([httpErrorInterceptor])),
        provideHttpClientTesting(),
        { provide: Router, useValue: router },
        {
          provide: ToastService,
          useValue: { show: (message: string) => toasts.push(message) },
        },
      ],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
  };

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('on the dashboard', () => {
    beforeEach(() => setup('/dashboard'));

    it('sends a 5xx to the server error page', () => {
      failWith(500);

      expect(navigatedTo).toBe('/dashboard/error');
    });

    it('sends a 401 to the unauthorized page', () => {
      failWith(401);

      expect(navigatedTo).toBe('/dashboard/unauthorized');
    });

    it('sends a 403 to the unauthorized page', () => {
      failWith(403);

      expect(navigatedTo).toBe('/dashboard/unauthorized');
    });

    it('redirects instead of stacking a toast on top of the page', () => {
      failWith(500);

      expect(toasts).toEqual([]);
    });

    it('leaves a dropped connection to the page own retry state', () => {
      // A blocked or offline request arrives as status 0, which is worth
      // retrying rather than routing away from.
      failWith(0);

      expect(navigatedTo).toBeNull();
      expect(toasts).toHaveLength(1);
    });

    it('does not redirect when already on an error page', () => {
      setup('/dashboard/error');

      failWith(500);

      expect(navigatedTo).toBeNull();
    });
  });

  describe('on the storefront', () => {
    beforeEach(() => setup('/products'));

    it('never navigates away, whatever the status', () => {
      failWith(500);

      expect(navigatedTo).toBeNull();
    });

    it('keeps showing the toast', () => {
      failWith(500);

      expect(toasts).toHaveLength(1);
    });
  });
});
