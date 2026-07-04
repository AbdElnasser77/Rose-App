import { Routes } from '@angular/router';

export const ProductsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/product-list/products.page').then((m) => m.ProductsPage),
    title: 'Products',
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/product-details/product-details.component').then((m) => m.ProductDetailsComponent),
    title: 'Product Details',
  }
];
