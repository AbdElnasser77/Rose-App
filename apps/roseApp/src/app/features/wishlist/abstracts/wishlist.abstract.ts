import { Observable } from "rxjs";
import { AddToWishlistPayload } from "../models/response/add-to-wishlist-response.model";
import { GetWishlistPayload } from "../models/response/get-wishlist-response.model";
import { MessagePayloadModel } from "../models/response/message-response.model";



export abstract class WishlistAbstract {
     abstract getWishlist(): Observable<GetWishlistPayload>;
    abstract addToWishlist(productId: string): Observable<AddToWishlistPayload>;
    abstract removeFromWishlist(productId: string): Observable<MessagePayloadModel>;
    abstract clearWishlist(): Observable<MessagePayloadModel>;
}