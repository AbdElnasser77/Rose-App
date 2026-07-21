import { Injectable } from '@angular/core';
import { AddToWishlistPayload, AddToWishlistResponseModel } from '../models/response/add-to-wishlist-response.model';

@Injectable({
  providedIn: 'root',
})
export class AddTowishlistAdaptor {
  adapt (response : AddToWishlistResponseModel) :AddToWishlistPayload{
     return  {
      wishlistItem : response.payload.wishlistItem 
    };
  }
}
