import { computed, inject, Injectable, signal } from '@angular/core';
import { CartService } from '../services/cart.service';
import { CartItem } from '../models/cart.model';
import { CouponModel } from '../../../shared/models/coupon.model';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartStore {
  private readonly _cartService = inject(CartService);
  
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
    this._cartService.getCart().subscribe({
    next: (res) => {
      this.cartItems.set(res);
      
    }
    });
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
  addToCart(productId: string) {
 
  return this._cartService.addToCart({
    productId,
    quantity: 1,
  }).pipe(
    tap(() => this.loadCart())
  );
  }
}
