import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  OnInit,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/cart.model';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RatingModule } from 'primeng/rating';
import { TranslatePipe } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { CartStore } from '../../store/cart.store';

@Component({
  selector: 'app-cart',
  imports: [ CommonModule,
  FormsModule,
  ButtonModule,
  InputTextModule,
  RatingModule,
  TranslatePipe,
  RouterLink],
  templateUrl: './cart.component.html'
})
export class CartComponent implements OnInit {
  private readonly router = inject(Router);
  private cartService = inject(CartService);
  coupon = signal('');
  couponData = signal<any>('');
  private destroyRef = inject(DestroyRef);
  discount = 0;
  private readonly _cartStore = inject(CartStore);
  cartItemsData: any;

  ngOnInit(): void {
    this.loadCart();
  }
  
  constructor() {
    effect(() => {
      this.cartItemsData = this._cartStore.cartItems();
    });
  }

  loadCart() {
    this._cartStore.loadcart();
  }
  
  getCoupon() {
    const couponCode = this.coupon().trim();
    if (!couponCode) return;

    this.cartService.getCoupons(couponCode)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.couponData.set(res);
        },
        error: (err) => {
          console.error(err);
        }
      });
  }

  increase(item: CartItem) {
    if(item.product.stock > item.quantity) {
      const quantity = ++item.quantity;
      this.cartService.updateCartQuantity(item.id, { quantity: quantity }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: _ => {
          this.loadCart();
        }
      });    
    }
  }

  decrease(item: CartItem) {
    if (item.quantity > 1) {
    const quantity = --item.quantity;
      this.cartService.updateCartQuantity(item.id, { quantity: quantity }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: _ => {
          this.loadCart();
        }
      });    
    }
  }

  remove(id: string) {
    this.cartService.deleteCartItem(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: _ => {
        this.loadCart();
      }
    });
  }

  clearCart() {
    this.cartService.clearCartItems().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: _ => {
        this.loadCart();
      }
    });
  }

  getItemPrice(item: CartItem): number {
    const price = Number(item.product.price);
    if (item.product.discountType === 'PERCENT') {
      return price - (price * Number(item.product.discountValue) / 100);
    }
    return price - Number(item.product.discountValue);
  }

  itemTotal(item: CartItem): number {
    return this.getItemPrice(item) * item.quantity;
  }

  subtotal = computed(() =>
    this._cartStore.cartItems().reduce((sum, item) =>
    sum + Number(item.product.price) * item.quantity
    , 0)
  );

  total = computed(() => {
    const itemsTotal = this._cartStore.cartItems().reduce(
      (sum, item) => sum + this.itemTotal(item),
      0
    );

    const coupon = this.couponData();

    if (!coupon) {
      return itemsTotal;
    }

    this.discount = 0;

    if (coupon.type === 'PERCENT') {
      this.discount = itemsTotal * (Number(coupon.value) / 100);

      if (coupon.maxDiscount) {
        this.discount = Math.min(this.discount, Number(coupon.maxDiscount));
      }
    } else if (coupon.type === 'FIXED') {
      this.discount = Number(coupon.value);
    }

    return Math.max(0, itemsTotal - this.discount);
  });

  goToProductDetails(productId: string): void {
    this.router.navigate(['/products', productId]);
  }
}
