import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { RegisterStore } from '@org/auth';

export const registerGuard: CanActivateFn = (route, state) => {
  const _registerStore = inject(RegisterStore);
  const _router = inject(Router);

  const email = _registerStore.email();
  const step = _registerStore.step();

  if (email && step == 3) {
    return true;
  }

    return _router.createUrlTree(['/auth/send-email-verification']);

};
