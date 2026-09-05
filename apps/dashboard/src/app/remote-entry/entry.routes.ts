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
      // Products, orders, notifications and settings hang off here as the
      // sprint's other dashboard tickets land.
    ],
  },
];
