import { Routes } from '@angular/router';
import { authGuard } from '@org/auth';
import { CheckoutLayoutComponent } from '../../layouts/checkout-layout/checkout-layout.component';

export const CartRoutes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
     component: CheckoutLayoutComponent,
      children: [
        {
          path: '',
          loadComponent: () =>
          import('./pages/cart/cart.page').then((m) => m.CartPage),
          title: 'cart',
        },

      ],
    
  },
];
