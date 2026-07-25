import { computed, inject, Injectable, signal } from '@angular/core';
import { CartService } from '../services/cart.service';
import { CartItem } from '../models/cart.model';

@Injectable({
  providedIn: 'root',
})
export class CartStore {
  private readonly _cartService = inject(CartService);
  
  readonly cartItems = signal<CartItem[]>([]);
   readonly couponData = signal<any>(null);

  readonly cartItemsdIds = computed (
    () => new Set(this.cartItems().map(item => item.id))
  );

  readonly cartCount = computed (
    () => this.cartItems().length
  );
  
  readonly subtotal = computed(() =>
    this.cartItems().reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0
    )
  );

   readonly discount = computed(() => {
    const coupon = this.couponData();

    if (!coupon) return 0;

    const itemsTotal = this.cartItems().reduce((sum, item) => {
      const price =
        item.product.discountType === 'PERCENT'
          ? Number(item.product.price) -
            Number(item.product.price) *
              Number(item.product.discountValue) /
              100
          : Number(item.product.price) -
            Number(item.product.discountValue);

      return sum + price * item.quantity;
    }, 0);

    if (coupon.type === 'PERCENT') {
      let value = itemsTotal * (Number(coupon.value) / 100);

      if (coupon.maxDiscount) {
        value = Math.min(value, Number(coupon.maxDiscount));
      }

      return value;
    }

    return Number(coupon.value);
  });

  readonly total = computed(() => {
    const itemsTotal = this.cartItems().reduce((sum, item) => {
      const price =
        item.product.discountType === 'PERCENT'
          ? Number(item.product.price) -
            Number(item.product.price) *
              Number(item.product.discountValue) /
              100
          : Number(item.product.price) -
            Number(item.product.discountValue);

      return sum + price * item.quantity;
    }, 0);

    return Math.max(0, itemsTotal - this.discount());
  });

  loadcart(): void {
    this._cartService.getCart().subscribe({
    next: (res) => {
      this.cartItems.set(res);
      console.log("AS", this.cartItems())
    }
    });
  }

   applyCoupon(coupon: any): void {
    this.couponData.set(coupon);
  }

  clearCoupon(): void {
    this.couponData.set(null);
  }
}
