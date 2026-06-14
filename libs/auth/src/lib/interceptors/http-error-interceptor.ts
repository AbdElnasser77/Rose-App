import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ErrorAdaptor } from '../adaptors/error.adaptor';
import { catchError, throwError } from 'rxjs';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
    const _errorAdaptor = inject(ErrorAdaptor);

  return next(req).pipe(
    catchError((error)=>{
      const message=_errorAdaptor.adapt(error);
      console.log(message);

      return throwError(()=>message);
    })
  );
};
