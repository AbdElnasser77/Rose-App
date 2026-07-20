import { Routes } from '@angular/router';

export const CartRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/cart/cart.component').then((m) => m.CartComponent),
    title: 'cart',
  }
];
