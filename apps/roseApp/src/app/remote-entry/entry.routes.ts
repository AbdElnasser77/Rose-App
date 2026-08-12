import { OrderRoutes } from './../features/order/order.routes';
import { Route } from '@angular/router';
import { MainLayoutComponent } from '../layouts/main-layout/main-layout.component';
import { authGuard } from '@org/auth';

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
      {
        path: 'order',
        loadChildren: () =>
          import('../features/order/order.routes').then(
            (m) => m.OrderRoutes,

          ),
      },
      {
        path: 'checkout',
        canActivate: [authGuard],
        loadChildren: () =>
        import('../features/checkout/checkout.routes').then(
          (m) => m.checkoutRoutes
        ),
      },
      {
        path: 'account',
        canActivate: [authGuard],
        loadChildren: () =>
          import('../features/account/account.routes').then(
            (m) => m.accountRoutes
          ),
      },
      // add products,cart,checkout all here.
    ],
  },
];
