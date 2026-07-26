import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CartStore } from '../../store/cart.store';
import { ButtonModule } from 'primeng/button';
import { TranslatePipe } from '@ngx-translate/core';
import { Router, RouterLink } from '@angular/router';
import { CartItemCardComponent } from '../../components/cart-item-card/cart-item-card.component';
import { CartItem } from '../../models/cart.model';
import { CartService } from '../../services/cart.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-cart',
  imports: [ButtonModule,TranslatePipe,RouterLink,CartItemCardComponent],
  templateUrl: './cart.page.html',
  styleUrl: './cart.page.scss',
})
export class CartPage implements OnInit {

  private readonly _cartStore = inject(CartStore);
  private readonly _cartService = inject(CartService);
  private readonly _router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly cartItems = this._cartStore.cartItems;
  readonly cartCount = this._cartStore.cartCount;

  ngOnInit(): void {
  this._cartStore.loadCart();
  }

  increase(item: CartItem): void {
  if (item.quantity >= item.product.stock) return;

     this._cartStore
    .increase(item)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: () => {
        this._cartStore.loadCart();
      }
    });
  }

  decrease(item: CartItem): void {
  if (item.quantity <= 1) return;

   this._cartStore
    .decrease(item)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: () => {
        this._cartStore.loadCart();
      },
    });
 }

  remove(id: string): void {
    this._cartStore
    .remove(id)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: () => {
        this._cartStore.loadCart();
      },
    });
  }

  clearCart(): void {
    this._cartStore
    .clearCart()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: () => {
        this._cartStore.loadCart();
      },
    });
  }

  goToProductDetails(productId: string): void {
  this._router.navigate(['/products', productId]);
  }
}
