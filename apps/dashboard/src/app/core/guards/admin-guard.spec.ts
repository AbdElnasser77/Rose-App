import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, UrlTree } from '@angular/router';
import { SessionService } from '@org/auth';

import { adminGuard } from './admin-guard';

describe('adminGuard', () => {
  let session: { isAuthenticated: () => boolean; isAdmin: () => boolean };

  /** Runs the guard in an injection context, as the router would. */
  const run = () =>
    TestBed.runInInjectionContext(() =>
      adminGuard(null as never, null as never),
    );

  const urlOf = (result: boolean | UrlTree) =>
    TestBed.inject(Router).serializeUrl(result as UrlTree);

  beforeEach(() => {
    session = { isAuthenticated: () => true, isAdmin: () => true };

    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: SessionService, useValue: session }],
    });
  });

  it('lets an authenticated admin through', () => {
    expect(run()).toBe(true);
  });

  it('sends a signed-out visitor to the login page', () => {
    session.isAuthenticated = () => false;

    expect(urlOf(run())).toBe('/auth/login');
  });

  it('sends a signed-in non-admin to the 401 page, not to login', () => {
    // Logging in again would not change the outcome for this user.
    session.isAdmin = () => false;

    expect(urlOf(run())).toBe('/dashboard/unauthorized');
  });
});
