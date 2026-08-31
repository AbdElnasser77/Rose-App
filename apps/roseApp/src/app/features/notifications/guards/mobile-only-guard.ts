import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const mobileOnlyGuard: CanActivateFn = () => {
  const router = inject(Router);
  const isMobile = window.matchMedia('(max-width: 767px)').matches;

   if (isMobile) {
    return true;
  }

  return router.createUrlTree(['/home']);
};
