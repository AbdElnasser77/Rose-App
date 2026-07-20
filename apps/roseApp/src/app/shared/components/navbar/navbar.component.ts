import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthFacade, AuthStore, SessionService } from '@org/auth';
import { LanguageSwitcherComponent } from '@rose/i18n';
import { ThemeToggleComponent } from '@rose/theme';
import { Bell, ChevronDown, ClipboardList, Gift, Headset, Heart, House, Info, LogOut, LucideAngularModule, MapPin, Menu, PartyPopper, ShoppingCart, User, X } from 'lucide-angular';
import { TranslatePipe } from '@ngx-translate/core';
import { AssetUrlPipe } from '../../../core/pipes/asset-url.pipe';
import { CartService } from '../../../features/cart/services/cart.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule, LanguageSwitcherComponent, ThemeToggleComponent, TranslatePipe, AssetUrlPipe],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  private readonly authStore = inject(AuthStore);
  private readonly sessionService = inject(SessionService);
  private readonly authFacade = inject(AuthFacade);
  private readonly router = inject(Router);

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
  readonly User = User;
  readonly ChevronDown = ChevronDown;
  readonly LogOut = LogOut;

  private cartService = inject(CartService);
  private destroyRef = inject(DestroyRef);
  cartCount = signal(0);

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
        this.cartCount.set(res.length);
      }
    });
  } 

  readonly isLoggedIn = computed(
    () => this.authStore.isAuthenticated() || this.sessionService.isAuthenticated()
  );
  readonly currentUser = localStorage.getItem('username'); // temporary for navbar **will be removed**

  isDropdownOpen = false;
  isMobileMenuOpen = false;

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
}