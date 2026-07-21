import { WishlistItemModel } from "../wishlist-item.model";

export interface GetWishlistResponseModel {
    status: boolean,
    code: number,
    payload: GetWishlistPayload;
}

export interface GetWishlistPayload {
  wishlistItems: WishlistItemModel[];
}
