import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ErrorAdaptor } from '../adaptors/error.adaptor';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '@org/shared-util-notification';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
    const _errorAdaptor = inject(ErrorAdaptor);
    const _toastService = inject(ToastService);
   

  return next(req).pipe(
    catchError((error)=>{
      const message=_errorAdaptor.adapt(error);
      _toastService.show(message, 'error');

      return throwError(()=>message);
    })
  );
};
