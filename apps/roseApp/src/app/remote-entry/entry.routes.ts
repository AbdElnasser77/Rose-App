import { Route } from '@angular/router';
import { MainLayoutComponent } from '../layouts/main-layout/main-layout.component';

export const remoteRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('../features/auth/auth.routes').then((m) => m.AuthRoutes),
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('../features/home/home.routes').then((m) => m.HomeRoutes),
      },
      {
        path: 'products',
        loadChildren: () =>
          import('../features/products/products.routes').then(
            (m) => m.ProductsRoutes,
          ),
      },
      {

        path: 'wishlist',
        loadChildren: () =>
          import('../features/wishlist/wishlist.routes').then(
            (m) => m.wishlistRoutes,
          )
      },
      {
        path: 'cart',
        loadChildren: () =>
          import('../features/cart/cart.routes').then(
            (m) => m.CartRoutes,

          ),
      },
      // add products,cart,checkout all here.
    ],
  },
];
