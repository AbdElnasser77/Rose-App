import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BASE_URL_CONFIG, SKIP_ERROR_TOAST } from '@org/auth';
import { CreateOrderRequestModel } from '../models/order/create-order-request.model';
import { CreateOrderResponseModel } from '../models/order/create-order-response.model';
import { SKIP_LOADER } from '@org/shared-util-loader';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
   private readonly _httpClient = inject(HttpClient);
   private readonly _baseUrlConfig =inject(BASE_URL_CONFIG);


   createOrder(body: CreateOrderRequestModel) {
  return this._httpClient.post<CreateOrderResponseModel>(
    `${this._baseUrlConfig.apiUrl}/orders`,
    body ,
          {
            context : new HttpContext()
            .set(SKIP_LOADER , true)
            .set(SKIP_ERROR_TOAST, true)
          }
  );
}
}
