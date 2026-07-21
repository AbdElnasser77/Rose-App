import { computed, inject, Injectable, signal } from '@angular/core';
import { WishlistItemModel } from '../models/wishlist-item.model';
import { WishlistService } from '../services/wishlist.service';
import { Observable, tap } from 'rxjs';
import { AddToWishlistPayload } from '../models/response/add-to-wishlist-response.model';
import { MessagePayloadModel } from '../models/response/message-response.model';

@Injectable({
  providedIn: 'root',
})
export class WishlistStore {
  private readonly _wishlistService = inject(WishlistService);
  
  private loaded = false;
  readonly wishlistItems = signal<WishlistItemModel[]>([]);

  readonly wishlistedIds = computed (
    () => new Set(this.wishlistItems().map(item => item.productId))
  );

  readonly wishlistCount = computed (
    () => this.wishlistItems().length
  );


  // Load wishlist from API
  loadWishlist(): void {
    if (this.loaded) return;

    this._wishlistService.getWishlist().subscribe({
    next: (res) => {
      this.wishlistItems.set(res.wishlistItems);
      this.loaded = true;
    }
    });
  }
  // Add product to wishlist
  add(productId: string): Observable<AddToWishlistPayload>{
    return this._wishlistService.addToWishlist(productId).pipe(
    tap(res => {
      this.wishlistItems.update(items => [
        ...items,
        res.wishlistItem
      ]);
    })
  );
  }
  // Remove product from wishlist 
  remove(wishlitItemId:string): Observable<MessagePayloadModel>{
    return this._wishlistService.removeFromWishlist(wishlitItemId).pipe(
      tap(() =>{
        this.wishlistItems.update(items =>
        items.filter(item => item.id!== wishlitItemId)
        );
      })
    );
  }

   clear(): Observable<MessagePayloadModel> {
    return this._wishlistService.clearWishlist().pipe(
    tap(() => {
      this.wishlistItems.set([]);
      this.loaded = false;
    })
  );
  }

  // Toggle wishlist
  toggle(productId: string): Observable<AddToWishlistPayload | MessagePayloadModel>{
    const item = this.wishlistItems().find(item => item.productId === productId);

    if (item ) {
       return this.remove(item?.id);
    } else {
      return this.add(productId);
    }
  }

   // Check if product exists
  isWishlisted(productId: string): boolean {
    return this.wishlistedIds().has(productId);
  }
}
