import { Route } from '@angular/router';
import { Root } from '../core/root/root';
import { adminGuard } from '../core/guards/admin-guard';

export const remoteRoutes: Route[] = [
  {
    // Declared before the layout route: the catch-all child below would
    // otherwise swallow this path and render the 404 instead.
    path: 'unauthorized',
    loadComponent: () =>
      import('../features/errors/pages/unauthorized/unauthorized.page').then(
        (m) => m.UnauthorizedPage,
      ),
  },
  {
    path: '',
    component: Root,
    canActivate: [adminGuard],
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
      {
        path: 'error',
        data: { breadcrumb: 'DASHBOARD.ERRORS.SERVER.BREADCRUMB' },
        loadComponent: () =>
          import('../features/errors/pages/server-error/server-error.page').then(
            (m) => m.ServerErrorPage,
          ),
      },
      {
        // Keep last: anything under /dashboard that matched nothing above.
        path: '**',
        data: { breadcrumb: 'DASHBOARD.ERRORS.NOT_FOUND.BREADCRUMB' },
        loadComponent: () =>
          import('../features/errors/pages/not-found/not-found.page').then(
            (m) => m.NotFoundPage,
          ),
      },
    ],
  },
];
