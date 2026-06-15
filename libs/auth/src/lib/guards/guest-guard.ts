import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '../services';

export const guestGuard: CanActivateFn = (route, state) => {
  const _sessionService = inject(SessionService);
  const router = inject(Router);

  if (!_sessionService.isAuthenticated()) {
    return true; 
  }
  return router.createUrlTree(['/home']);
};
