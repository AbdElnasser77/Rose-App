import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '@org/auth';
import { CartService } from '../services/cart.service';
import { CartItem } from '../models/cart.model';
import { CouponModel } from '../../../shared/models/coupon.model';
import { EMPTY, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartStore {
  private readonly _cartService = inject(CartService);
  private readonly _sessionService = inject(SessionService);
  private readonly _router = inject(Router);

  readonly cartItems = signal<CartItem[]>([]);
  readonly coupon = signal<CouponModel | null>(null);

  readonly cartItemIds = computed (
    () => new Set(this.cartItems().map(item => item.id))
  );

  readonly cartCount = computed (
    () =>  this.cartItems().reduce(
    (count, item) => count + item.quantity,
    0
   )
  );

   // Total price before discounts
  readonly subtotal = computed(() =>
    this.cartItems().reduce(
    (total,item) => total + Number(item.product.price)  * item.quantity ,
    0
    )
  );
   // Discount amount based on applied coupon
  readonly discount = computed(() => {
     const coupon = this.coupon();

     if (!coupon) {
      return 0;
     }

    const subtotal = this.subtotal();

    // Re-checked here, not only on apply: removing items can drop the subtotal back
    // under the minimum while a valid coupon is already attached.
    if (subtotal < Number(coupon.minPurchase)) {
      return 0;
    }

    let discount = 0;

    if (coupon.type === 'PERCENT') {
        discount = subtotal * (Number(coupon.value) /100)

       if(coupon.maxDiscount){
         discount = Math.min(discount , Number(coupon.maxDiscount));
       }
      
    }else {
    discount = Number(coupon.value);
    }
     return Math.min(discount, subtotal);

  });

  // Total price after discounts
  readonly total = computed (()=>
     this.subtotal() - this.discount()
  );

 
  // Update applied coupon
  setCoupon(coupon: CouponModel | null): void {
  this.coupon.set(coupon);
  }

   // Load cart from API
   loadCart(): void {
    if (!this._sessionService.isAuthenticated()) {
      return;
    }

    this._cartService.getCart().subscribe({
    next: (res) => {
      this.cartItems.set(res);

    }
    });
  }

  reset(): void {
    this.cartItems.set([]);
    this.coupon.set(null);
  }



  //  increase
  increase(item: CartItem) {
    
    return  this._cartService
    .updateCartQuantity(item.id, {
    quantity: item.quantity + 1,
    });
  }


  // decrease
  decrease(item: CartItem) {
  return this._cartService.updateCartQuantity(item.id, {
    quantity: item.quantity - 1,
  });
  }


  //  remove
  remove(itemId: string) {
  return this._cartService.deleteCartItem(itemId);
  }

  // clearCart
  clearCart() {
  return this._cartService.clearCartItems();
  }


  

  // Check if product in cart 
  isProductInCart(productId: string): boolean {
  return this.cartItems().some(
    item => item.productId === productId
  );
 }

 // add to cart
  addToCart(productId: string): Observable<any> {

  if (!this._sessionService.isAuthenticated()) {
    this._router.navigate(['/auth/login']);
    return EMPTY;
  }

  return this._cartService.addToCart({
    productId,
    quantity: 1,
  }).pipe(
    tap(() => this.loadCart())
  );
  }


  // Apply coupon
  // There is no server-side validate endpoint, so the rules on the coupon record are
  // enforced here. The thrown message is an i18n key for the caller to translate.
   applyCoupon(code: string) {
  const wanted = code.trim();

  return this._cartService.getCoupons(wanted).pipe(
    tap((coupons) => {

      const coupon = coupons.find(
        (c: CouponModel) =>
          c.code.toLowerCase() === wanted.toLowerCase()
      );

      if (!coupon || !coupon.isActive) {
        throw new Error('CART.INVALID_COUPON');
      }

      if (!this.isWithinValidityWindow(coupon)) {
        throw new Error('CART.COUPON_EXPIRED');
      }

      if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
        throw new Error('CART.COUPON_USED_UP');
      }

      if (this.subtotal() < Number(coupon.minPurchase)) {
        throw new Error('CART.COUPON_MIN_PURCHASE');
      }

      this.coupon.set(coupon);
    })
  );
  }

  private isWithinValidityWindow(coupon: CouponModel): boolean {
    const now = Date.now();
    const from = new Date(coupon.validFrom).getTime();
    const until = new Date(coupon.validUntil).getTime();

    return now >= from && now <= until;
  }
}
