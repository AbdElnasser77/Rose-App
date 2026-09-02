import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BASE_URL_CONFIG } from '@org/auth';

import { CheckCheckoutSessionResponseModel } from '../models/payment/check-checkout-session-response.model';
import { CreateCheckoutSessionResponseModel } from '../models/payment/create-checkout-session-response.model';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
   private readonly _httpClient = inject(HttpClient);
   private readonly _baseUrlConfig =inject(BASE_URL_CONFIG);

   createCheckoutSession(orderId: string){
    return this._httpClient.post<CreateCheckoutSessionResponseModel>(
      `${this._baseUrlConfig.apiUrl}/payments/checkout-session`,
      { orderId }
      );
    }

    
    checkCheckoutSession(sessionId: string){
      return this._httpClient.get<CheckCheckoutSessionResponseModel>(
        `${this._baseUrlConfig.apiUrl}/payments/checkout-session`,
        {
          params : {
            sessionId: sessionId
          } 
        }
        );
    }
}
