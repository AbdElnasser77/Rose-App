import { Routes } from '@angular/router';
import { authGuard } from '@org/auth';

export const CartRoutes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/cart/cart.component').then((m) => m.CartComponent),
    title: 'cart',
  }
];
