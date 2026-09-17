import { HttpContextToken, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ErrorAdaptor } from '../adaptors/error.adaptor';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '@org/shared-util-notification';
import { Router } from '@angular/router';

export const SKIP_ERROR_TOAST = new HttpContextToken<boolean>(() => false);

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
    const _errorAdaptor = inject(ErrorAdaptor);
    const _toastService = inject(ToastService);
    const _router = inject(Router);
   

  return next(req).pipe(
    catchError((error)=>{
      const message=_errorAdaptor.adapt(error);

      // The dashboard has dedicated pages for these states. Everywhere else -
      // the storefront - keeps the toast and stays on the current page.
      const url = _router.url;
      const alreadyOnErrorPage =
        url.startsWith('/dashboard/unauthorized') || url.startsWith('/dashboard/error');

      if (url.startsWith('/dashboard') && !alreadyOnErrorPage) {
        const status = error?.status;

        if (status === 401 || status === 403) {
          _router.navigateByUrl('/dashboard/unauthorized');
          return throwError(() => message);
        }

        if (status >= 500) {
          _router.navigateByUrl('/dashboard/error');
          return throwError(() => message);
        }
      }

       if (!req.context.get(SKIP_ERROR_TOAST)) {
        _toastService.show(message, 'error');
      }
      

      return throwError(()=>message);
    })
  );
};
