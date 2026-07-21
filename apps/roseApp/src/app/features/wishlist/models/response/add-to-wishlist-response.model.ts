import { WishlistItemModel } from "../wishlist-item.model";

export interface AddToWishlistResponseModel {
    status: boolean;
  code: number;
  payload: AddToWishlistPayload;
}
export interface AddToWishlistPayload {
  wishlistItem: WishlistItemModel;
}