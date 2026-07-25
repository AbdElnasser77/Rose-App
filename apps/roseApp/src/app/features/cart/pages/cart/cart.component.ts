import {
  Component,
  computed,
  DestroyRef,
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
import { OrderSummaryComponent } from '../../../../shared/components/order-summary/order-summary.component';

@Component({
  selector: 'app-cart',
  imports: [ CommonModule,
  FormsModule,
  ButtonModule,
  InputTextModule,
  RatingModule,
  TranslatePipe,
  RouterLink ,OrderSummaryComponent],
  templateUrl: './cart.component.html'
})
export class CartComponent implements OnInit {

  private cartService = inject(CartService);
  
  coupon = signal('');
  
  private destroyRef = inject(DestroyRef);
  
  private readonly _cartStore = inject(CartStore);
  private readonly router = inject(Router);
  readonly cartItems = this._cartStore.cartItems;

 readonly subtotal = this._cartStore.subtotal;
 readonly total = this._cartStore.total;
 readonly couponData = this._cartStore.couponData;

  ngOnInit(): void {
    this.loadCart();
  }
  


  loadCart() {
    this.cartService.getCart()
    .pipe(
      takeUntilDestroyed(this.destroyRef)
    )
    .subscribe({
      next: (res) => {
        this.cartItems.set(res);
      }
    });
  }
  
  getCoupon() {
    const couponCode = this.coupon().trim();
    if (!couponCode) return;

    this.cartService.getCoupons(couponCode)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this._cartStore.applyCoupon(res);
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

  
  goToProductDetails(productId: string): void {
    this.router.navigate(['/products', productId]);
  }
}
