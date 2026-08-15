import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {  RouterLink } from '@angular/router';
import { AuthStore, SessionService } from '@org/auth';
import { LanguageSwitcherComponent } from '@rose/i18n';
import { ThemeToggleComponent } from '@rose/theme';
import { Bell, Heart, LucideAngularModule,  ShoppingCart ,Menu ,X ,Search} from 'lucide-angular';
import { AssetUrlPipe } from '../../../../core/pipes/asset-url.pipe';
import { WishlistStore } from '../../../../features/wishlist/store/wishlist.store';
import { CartStore } from '../../../../features/cart/store/cart.store';
import { AddressModalService } from '../../../../features/checkout/services/address-modal.service';
import { AddressStore } from '../../../../features/checkout/store/address.store';
import { CheckoutStore } from '../../../../features/checkout/store/checkout.store';
import { ProductSearchComponent } from '../product-search/product-search.component';
import { UserMenuComponent } from '../user-menu/user-menu.component';
import { MainNavLinksComponent } from '../main-nav-links/main-nav-links.component';
import { MobileMenuComponent } from '../mobile-menu/mobile-menu.component';
import { MobileBottomNavComponent } from '../mobile-bottom-nav/mobile-bottom-nav.component';
import { DeliveryAddressComponent } from '../delivery-address/delivery-address.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule,LanguageSwitcherComponent,
     ThemeToggleComponent, AssetUrlPipe, ProductSearchComponent 
     ,UserMenuComponent ,MainNavLinksComponent ,
     MobileMenuComponent ,MobileBottomNavComponent ,DeliveryAddressComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  private readonly authStore = inject(AuthStore);
  private readonly sessionService = inject(SessionService);
  private readonly _wishlistStore = inject(WishlistStore);
  private readonly _cartStore = inject(CartStore);
  private readonly addressModal = inject(AddressModalService);
  private readonly addressStore = inject(AddressStore);
  private readonly _checkoutStore = inject(CheckoutStore);
  private readonly destroyRef = inject(DestroyRef);

  readonly wishlistCount = this._wishlistStore.wishlistCount;
  readonly cartCount = this._cartStore.cartCount;

 
  readonly ShoppingCart = ShoppingCart;
  readonly Bell = Bell;
  readonly Heart = Heart;
  readonly  X =  X;
  readonly Menu = Menu;
  readonly Search = Search;
  
  readonly isMobileMenuOpen = signal(false);
  toggleMobileMenu(): void {

   this.isMobileMenuOpen.update(value => !value);
  }

 

 
  readonly isLoggedIn = computed(
    () => this.authStore.isAuthenticated() || this.sessionService.isAuthenticated()
  );

  constructor() {
    // Reload on login and drop on logout, since the navbar outlives both.
    effect(() => {
      if (!this.isLoggedIn()) {
        this.addressStore.clear();
        this._cartStore.reset();
        this._wishlistStore.reset();
        // Persisted now, so it would otherwise outlive the session it belongs to.
        this._checkoutStore.clear();
        return;
      }
      this.addressStore
        .load()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe();
      this._cartStore.loadCart();
      this._wishlistStore.loadWishlist();
    });
  }
 
 
  

  openAddressModal(): void {
    this.addressModal.open();
  }

  
}