import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BASE_URL_CONFIG, SKIP_ERROR_TOAST } from '@org/auth';
import { CreatePaymentIntentRequest } from '../models/payment/create-payment-intent-request';
import { CreatePaymentIntentResponse } from '../models/payment/create-payment-intent-response';
import { ConfirmPaymentRequestModel } from '../models/payment/confirm-payment-request.model';
import { ConfirmPaymentResponseModel } from '../models/payment/confirm-payment-response.model';
import { SKIP_LOADER } from '@org/shared-util-loader';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
   private readonly _httpClient = inject(HttpClient);
   private readonly _baseUrlConfig =inject(BASE_URL_CONFIG);

   createIntent (body : CreatePaymentIntentRequest){
    return this._httpClient.post<CreatePaymentIntentResponse>(
      `${this._baseUrlConfig.apiUrl}/payments/create-intent`,
      body ,
      {
        context : new HttpContext()
        .set(SKIP_LOADER , true)
        .set(SKIP_ERROR_TOAST, true)
      }
    );
   }

   confirmPayment (body : ConfirmPaymentRequestModel){
    return this._httpClient.post<ConfirmPaymentResponseModel>(
      `${this._baseUrlConfig.apiUrl}/payments/confirm`,
      body ,
      {
        context : new HttpContext()
        .set(SKIP_LOADER , true) 
        .set(SKIP_ERROR_TOAST, true)

      }
    );

   }
}
