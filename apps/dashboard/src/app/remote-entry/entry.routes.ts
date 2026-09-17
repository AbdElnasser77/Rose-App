import { Route } from '@angular/router';
import { Root } from '../core/root/root';
import { adminGuard } from '../core/guards/admin-guard';
import { AccountComponent } from '../features/overview/pages/account/account.component';

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
        // /dashboard is not a page of its own - it lands on the overview.
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'overview',
        loadChildren: () =>
          import('../features/overview/overview.routes').then(
            (m) => m.OverviewRoutes,
          ),
      },
      {
        // Carries the "Categories" crumb for every page underneath, so add and
        // edit read Dashboard > Categories > ... instead of skipping a level.
        path: 'categories',
        data: { breadcrumb: 'DASHBOARD.CATEGORIES.BREADCRUMB' },
        loadChildren: () =>
          import('../features/categories/categories.routes').then(
            (m) => m.CategoriesRoutes,
          ),
      },
      {
        path: 'products',
        data: { breadcrumb: 'DASHBOARD.PRODUCTS.TITLE' },
        loadChildren: () =>
          import('../features/products/products.routes').then(
            (m) => m.ProductsRoutes,
          ),
      },      
      {
        path: 'occasions',
        loadChildren: () =>
          import('../features/occasionsa/occasions.routes').then(
            (m) => m.OccasionsRoutes,
          ),
      },
      {
        path: 'account',
        component: AccountComponent,
        data: { breadcrumb: "ACCOUNT.TITLE"},
        children: [
          {
            path: '',
            redirectTo: 'profile',
            pathMatch: 'full',
          },
          {
            path: 'profile',
            data: { breadcrumb: "ACCOUNT.NAV.PROFILE"},
            loadComponent: () =>
              import('@org/auth').then((m) => m.ProfilePage),
            title: 'profile',
          },
          {
            path: 'password',
            data: { breadcrumb: "ACCOUNT.NAV.CHANGE_PASSWORD"},
            loadComponent: () =>
              import('@org/auth').then(
                (m) => m.ChangePasswordPage
              ),
            title: 'change-password',
          },
        ],
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
