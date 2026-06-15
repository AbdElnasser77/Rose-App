import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthStorageService } from '../services';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
   const _authStorageService= inject(AuthStorageService);

  const token = _authStorageService.getToken();

  if (!token) {
    return next(req);
  }

   const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(authReq);
};
