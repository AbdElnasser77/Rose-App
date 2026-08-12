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

    const serverMessage = this.extractServerMessage(error);

    if (error.status === 401) {
      return this.isGenericUnauthorized(serverMessage)
        ? 'Unauthorized, please login again'
        : serverMessage;
    }

    return serverMessage || 'Something went wrong';
  }

  private extractServerMessage(error: HttpErrorResponse): string {
    if (error.error?.errors && Array.isArray(error.error.errors)) {
      const detailedMessages = error.error.errors.map((err: any) => {
        if (err.messages && Array.isArray(err.messages)) {
          return err.messages.join('. ');
        }
        if (err.message) {
          return err.message;
        }
        return '';
      });

      const joined = detailedMessages.filter(Boolean).join('\n');
      if (joined) return joined;
    }

    return error?.error?.message || '';
  }

  private isGenericUnauthorized(message: string): boolean {
    return !message || /^unauthori[sz]ed\.?$/i.test(message.trim());
  }
}
