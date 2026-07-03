import { Routes } from '@angular/router';

export const ProductsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/products/products.page').then((m) => m.ProductsPage),
  },
  // {
  //   path: ':id',
  //   loadComponent: () => import('./pages/product-detail/product-detail.page').then((m) => m.ProductDetailPage)
  // }
];
