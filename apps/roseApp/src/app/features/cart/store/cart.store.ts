import { computed, inject, Injectable, signal } from '@angular/core';
import { CartService } from '../services/cart.service';
import { CartItem } from '../models/cart.model';

@Injectable({
  providedIn: 'root',
})
export class CartStore {
  private readonly _cartService = inject(CartService);
  
  readonly cartItems = signal<CartItem[]>([]);

  readonly cartItemsdIds = computed (
    () => new Set(this.cartItems().map(item => item.id))
  );

  readonly cartCount = computed (
    () => this.cartItems().length
  );

  loadcart(): void {
    this._cartService.getCart().subscribe({
    next: (res) => {
      this.cartItems.set(res);
      console.log("AS", this.cartItems())
    }
    });
  }
}
