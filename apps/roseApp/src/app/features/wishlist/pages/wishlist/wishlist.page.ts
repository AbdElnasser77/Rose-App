import { Component, computed, DestroyRef, inject, signal} from '@angular/core';
import { WishlistCardComponent } from '../../components/wishlist-card/wishlist-card.component';
import { CommonModule } from '@angular/common';
import { ToastService } from '@org/shared-util-notification';
import { LucideAngularModule, FolderHeart ,BrushCleaning ,MoveLeft } from 'lucide-angular';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { WishlistStore } from '../../store/wishlist.store';
import { Router } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CartService } from '../../../cart/services/cart.service';
import { CartStore } from '../../../cart/store/cart.store';
@Component({
  selector: 'app-wishlist',
  imports: [WishlistCardComponent ,CommonModule,LucideAngularModule ,TranslatePipe,DialogModule],
  templateUrl: './wishlist.page.html',
  styleUrl: './wishlist.page.scss',
})
export class WishlistPage {
  private readonly _wishlistStore = inject(WishlistStore);
  private readonly _translateService = inject(TranslateService);
  private readonly _toastService=inject(ToastService);
  private readonly _router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
   private readonly _cartStore = inject(CartStore);
 

  readonly wishlistItems = this._wishlistStore.wishlistItems;
  readonly isRtl = computed(() => (this._translateService.currentLang()) === 'ar');

  readonly isClearModalOpen = signal(false);
  readonly FolderHeart = FolderHeart;
  readonly BrushCleaning = BrushCleaning;
  readonly MoveLeft = MoveLeft ;

  openClearModal(): void {
    this.isClearModalOpen.set(true);
  }
  closeClearModal(): void {
    this.isClearModalOpen.set(false);
  }
  confirmClearWishlist(): void {
    this.closeClearModal();
    this._wishlistStore.clear().subscribe({
    next: () => {
    this._toastService.show(
      this._translateService.instant('WISHLIST.WISHLIST_CLEARED')
    );
  }
  });
    
  }

   removeFromWishlist(productId: string): void {
    this._wishlistStore.remove(productId).subscribe({
    next: () => {
      this._toastService.show(
        this._translateService.instant('WISHLIST.ITEM_REMOVED')
      );
    },
    });
   }

  
   addToCart(productId:string):void{
      if (this._cartStore.isProductInCart(productId)) {
           this._toastService.show(
           this._translateService.instant('CART.ALREADY_IN_CART'),
           'default'
           );
           return;
           }
     
          this._cartStore
          .addToCart(productId)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
          next: (res) => {
           if (res.message === 'Insufficient stock.') {
             this._toastService.show(
               this._translateService.instant('CART.OUT_OF_STOCK'),
               'error'
             );
           } else {
             this._toastService.show(
               this._translateService.instant('CART.PRODUCT_ADDED'),
               'success'
             );
           }
         },
       });
    
   }
   
   
  onCardDetailsClicked(productId :string){
    this._router.navigate(['/products',productId]);
  }
  onContinueShoppingClicked() {
    this._router.navigate(['/products']);
  }
  onExploreSimilarProducts(productId: string): void {
  this._router.navigate(['/products', productId]);
 }
}
