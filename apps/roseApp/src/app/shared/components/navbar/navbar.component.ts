import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, effect, HostListener, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { AuthFacade, AuthStore, SessionService } from '@org/auth';
import { LanguageSwitcherComponent } from '@rose/i18n';
import { ThemeToggleComponent } from '@rose/theme';
import { Bell, ChevronDown, ClipboardList, Gift, Headset, Heart, House, Info, LogOut, LucideAngularModule, MapPin, MapPinPlus, Menu, PartyPopper, ShoppingCart, User, X } from 'lucide-angular';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AssetUrlPipe } from '../../../core/pipes/asset-url.pipe';
import { WishlistStore } from '../../../features/wishlist/store/wishlist.store';
import { CartStore } from '../../../features/cart/store/cart.store';
import { AddressModalService } from '../../../features/checkout/services/address-modal.service';
import { AddressStore } from '../../../features/checkout/store/address.store';
import { CheckoutStore } from '../../../features/checkout/store/checkout.store';
import { Product } from '../../models/product.model';
import { ProductSearchCardComponent } from '../product-search-card/product-search-card.component';
import { ProductsService } from '../../../core/services/products.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule, LanguageSwitcherComponent,
     ThemeToggleComponent, TranslatePipe, AssetUrlPipe, ProductSearchCardComponent  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  private readonly authStore = inject(AuthStore);
  private readonly sessionService = inject(SessionService);
  private readonly authFacade = inject(AuthFacade);
  private readonly router = inject(Router);
  private readonly _wishlistStore = inject(WishlistStore);
  private readonly _cartStore = inject(CartStore);
  private readonly addressModal = inject(AddressModalService);
  private readonly addressStore = inject(AddressStore);
  private readonly _checkoutStore = inject(CheckoutStore);
  private readonly destroyRef = inject(DestroyRef);
  private _translateService = inject(TranslateService);
  private readonly _productsService = inject(ProductsService);

  readonly wishlistCount = this._wishlistStore.wishlistCount;
  readonly cartCount = this._cartStore.cartCount;
  readonly deliveryAddress = this.addressStore.deliveryAddress;

  readonly Menu = Menu;
  readonly X = X;
  readonly House = House;
  readonly Gift = Gift;
  readonly ClipboardList = ClipboardList;
  readonly PartyPopper = PartyPopper;
  readonly Info = Info;
  readonly Headset = Headset;
  readonly ShoppingCart = ShoppingCart;
  readonly Bell = Bell;
  readonly Heart = Heart;
  readonly MapPin = MapPin;
  readonly MapPinPlus = MapPinPlus;
  readonly User = User;
  readonly ChevronDown = ChevronDown;
  readonly LogOut = LogOut;
  

  // Search
  @HostListener('document:click',['$event'])
  onDocumentClick(event :MouseEvent):void{
      const target = event.target as HTMLElement;

      if (!target.closest('.search-container')) {
       this.closeSearch();
      }
  }
  searchTerm = signal('');
  isSearchOpen = signal(false);
  allProducts = signal<Product[]>([]);

  readonly filteredProducts = computed(() => {
  const term = this.searchTerm().trim().toLowerCase();

  if (!term) {
    return this.allProducts();
  }

  return this.allProducts().filter(product =>
    product.title.toLowerCase().includes(term)
  );
  });
 
  onSearch(value: string) {
  this.searchTerm.set(value);

  }

  openSearch() {
  this.isSearchOpen.set(true);
  }

  closeSearch() {
  this.isSearchOpen.set(false);
  }
   
  openProductDetails(id: string) {
  this.router.navigate(['/products', id]);
  this.closeSearch();
  }
  readonly isLoggedIn = computed(
    () => this.authStore.isAuthenticated() || this.sessionService.isAuthenticated()
  );
  readonly currentUser = localStorage.getItem('username'); // temporary for navbar **will be removed**

  isDropdownOpen = false;
  isMobileMenuOpen = false;
  
   readonly isRtl = computed(() => (this._translateService.currentLang()) === 'ar');
 
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

  goToLogin(): void {
    this.router.navigate(['/auth']);
  }

  goToRegister(): void {
    this.router.navigate(['/auth/register']);
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  logout(): void {
    this.authFacade.logout();
    this.isDropdownOpen = false;
    this.isMobileMenuOpen = false;
    this.router.navigate(['/auth']);
  }
    onWishlistClicked() {
    this.router.navigate(['/wishlist']);
  }

  openAddressModal(): void {
    this.addressModal.open();
  }

  ngOnInit() {
  this._productsService.getProducts().subscribe({
    next: (res) => {
      this.allProducts.set(res.payload.data);
    }
  });
}
}