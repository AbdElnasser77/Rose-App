import { Injectable } from '@angular/core';
import { GetWishlistPayload, GetWishlistResponseModel } from '../models/response/get-wishlist-response.model';

@Injectable({
  providedIn: 'root',
})
export class WishlistAdaptor {
  adapt(response : GetWishlistResponseModel) : GetWishlistPayload{
       return {
         wishlistItems:response.payload.wishlistItems ,
       } ;
  }
}
