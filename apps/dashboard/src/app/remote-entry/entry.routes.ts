import { Route } from '@angular/router';
import { Root } from '../core/root/root';

export const remoteRoutes: Route[] = [
  {
    path: '',
    component: Root,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('../features/overview/overview.routes').then(
            (m) => m.OverviewRoutes,
          ),
      },
      {
        path: 'products',
        loadChildren: () =>
          import('../features/products/products.routes').then(
            (m) => m.ProductsRoutes,
          ),
      },
    ],
  },
];
