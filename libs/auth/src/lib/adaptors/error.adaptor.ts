import { Injectable } from '@angular/core';
import { AdaptorModel } from '../models/adaptor.model';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ErrorAdaptor 
implements AdaptorModel<HttpErrorResponse,string>{
  adapt(error: HttpErrorResponse): string {
     if (error.status === 0) {
    return 'No internet connection';
  }

  if (error.status === 401) {
    return 'Unauthorized, please login again';
  }

  return error?.error?.message || 'Something went wrong';
  }

  
}
