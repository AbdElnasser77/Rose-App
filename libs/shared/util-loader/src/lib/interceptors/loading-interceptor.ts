import { HttpContextToken, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoaderService } from '../services/loader.service';

export const SKIP_LOADER = new HttpContextToken<boolean>(() => false);

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.context.get(SKIP_LOADER)) {
    return next(req);
  }

  const loaderService = inject(LoaderService);

  return next(req).pipe(
    loaderService.track()
  );
};
