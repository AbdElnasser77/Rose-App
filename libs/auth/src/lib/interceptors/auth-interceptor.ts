import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import {  TokenService } from '../services';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
   const _tokenService= inject(TokenService);

  const token = _tokenService.getToken();

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
