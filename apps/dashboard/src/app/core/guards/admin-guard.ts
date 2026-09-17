import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '@org/auth';

/**
 * The dashboard is admin-only.
 *
 * A signed-out visitor goes to the login page, matching how the storefront's
 * `authGuard` behaves. A signed-in non-admin gets the 401 page instead —
 * sending them to log in again would not change the outcome.
 */
export const adminGuard: CanActivateFn = () => {
  const session = inject(SessionService);
  const router = inject(Router);

  if (!session.isAuthenticated()) {
    return router.createUrlTree(['/auth/login']);
  }

  return session.isAdmin()
    ? true
    : router.createUrlTree(['/dashboard/unauthorized']);
};
