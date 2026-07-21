import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BASE_URL_CONFIG } from '@org/auth';
import { WishlistAdaptor } from '../adaptors/wishlist.adaptor';
import { map, Observable } from 'rxjs';
import { GetWishlistPayload, GetWishlistResponseModel } from '../models/response/get-wishlist-response.model';
import { AddToWishlistPayload, AddToWishlistResponseModel } from '../models/response/add-to-wishlist-response.model';
import { AddTowishlistAdaptor } from '../adaptors/add-towishlist.adaptor';
import { MessagePayloadModel, MessageResponseModel } from '../models/response/message-response.model';
import { MessageAdaptor } from '../adaptors/message.adaptor';
import { WishlistAbstract } from '../abstracts/wishlist.abstract';

@Injectable({
  providedIn: 'root',
})
export class WishlistService extends  WishlistAbstract {
 
  
  private readonly _httpClient = inject(HttpClient);
  private readonly _baseUrlConfig =inject(BASE_URL_CONFIG);
  private readonly _wishlistAdaptor=inject(WishlistAdaptor);
  private readonly _addToWishlistAdaptor=inject(AddTowishlistAdaptor);
  private readonly _messageAdaptor=inject(MessageAdaptor);

   // Get all wishlist items
  getWishlist(): Observable<GetWishlistPayload> {
     return this._httpClient.get<GetWishlistResponseModel>(
       `${this._baseUrlConfig.apiUrl}/wishlist`
    ).pipe(
      map((res) => this._wishlistAdaptor.adapt(res))
    );
  }

   // Add product to wishlist
  addToWishlist(productId: string): Observable<AddToWishlistPayload> {
    return this._httpClient.post<AddToWishlistResponseModel>(
       `${this._baseUrlConfig.apiUrl}/wishlist`,
       {productId}
    ).pipe(
      map((res) => this._addToWishlistAdaptor.adapt(res))
    );
  }
  
  // Remove product from wishlist
  removeFromWishlist(productId: string): Observable<MessagePayloadModel> {
    return this._httpClient.delete<MessageResponseModel>(
       `${this._baseUrlConfig.apiUrl}/wishlist/${productId}`
    ).pipe(
      map((res) => this._messageAdaptor.adapt(res))
    );
  }

  // Clear wishlist
  clearWishlist(): Observable<MessagePayloadModel> {
    return this._httpClient.delete<MessageResponseModel>(
       `${this._baseUrlConfig.apiUrl}/wishlist`
    ).pipe(
      map((res) => this._messageAdaptor.adapt(res))
    );
  }


  


  
}
