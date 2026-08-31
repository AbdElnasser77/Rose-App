import { Route } from '@angular/router';
import { DashboardLayoutComponent } from '../layouts/dashboard-layout/dashboard-layout.component';

export const remoteRoutes: Route[] = [
  {
    path: '',
    component: DashboardLayoutComponent,
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
