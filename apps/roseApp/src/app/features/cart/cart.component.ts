import {
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { CartService } from './services/cart.service';
import { CartItem } from './models/cart.model';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RatingModule } from 'primeng/rating';
import { TranslatePipe } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-cart',
  imports: [ CommonModule,
  FormsModule,
  ButtonModule,
  InputTextModule,
  RatingModule,
  TranslatePipe],
  templateUrl: './cart.component.html'
})
export class CartComponent implements OnInit {

  private cartService = inject(CartService);
  cartItems = signal<CartItem[]>([]);
  coupon = signal('');
  private destroyRef = inject(DestroyRef);

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

  increase(item: CartItem) {
    if(item.product.stock > item.quantity) {
      const quantity = ++item.quantity;
      this.cartService.updateCartQuantity(item.id, { quantity: quantity }).subscribe({
        next: _ => {
          this.loadCart();
        }
      });    
    }
  }

  decrease(item: CartItem) {
    if (item.quantity > 1) {
    const quantity = --item.quantity;
      this.cartService.updateCartQuantity(item.id, { quantity: quantity }).subscribe({
        next: _ => {
          this.loadCart();
        }
      });    
    }
  }

  remove(id: string) {
    this.cartService.deleteCartItem(id).subscribe({
      next: _ => {
        this.loadCart();
      }
    });
  }

  clearCart() {
    this.cartService.clearCartItems().subscribe({
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
    this.cartItems().reduce((sum, item) =>
      sum + Number(item.product.price) * item.quantity
    , 0)
  );

  total = computed(() =>
    this.cartItems().reduce((sum, item) =>
      sum + this.itemTotal(item)
    , 0)
  );

}
