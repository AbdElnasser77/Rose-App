import { Component, computed, inject, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthStore, SessionService } from '@org/auth';
import { Bell, Heart, House, LucideAngularModule, ShoppingCart, User } from 'lucide-angular';

@Component({
  selector: 'app-mobile-bottom-nav',
  imports: [ LucideAngularModule ,RouterLink ,TranslatePipe ,
    RouterLinkActive   ],
  templateUrl: './mobile-bottom-nav.component.html',
  styleUrl: './mobile-bottom-nav.component.scss',
})
export class MobileBottomNavComponent {
  private readonly authStore = inject(AuthStore);
  private readonly sessionService = inject(SessionService);
  
  readonly wishlistCount = input(0);
  readonly cartCount = input(0);
  readonly notificationsCount=input(2);
  readonly Bell = Bell;

    readonly isLoggedIn = computed(
    () => this.authStore.isAuthenticated() || this.sessionService.isAuthenticated()
   );
  readonly mobileBottomItems = [
  {
    label: 'NAV.HOME',
    route: '/home',
    icon: House,
    type: 'home',
  },
  {
    label: 'NAV.WISHLIST',
    route: '/wishlist',
    icon: Heart,
    type: 'wishlist',
  },
   {
    label: 'NAV.NOTIFICATIONS',
    route: '/notifications',
    icon: Bell,
    type: 'notifications',
  },
  {
    label: 'NAV.CART',
    route: '/cart',
    icon: ShoppingCart,
    type: 'cart',
  },
  {
    label: 'NAV.ACCOUNT',
    route: '/account/profile',
    icon: User,
    type: 'account',
  }
];
}
