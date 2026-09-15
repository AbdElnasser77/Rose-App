import { Route } from '@angular/router';
import { Root } from '../core/root/root';
import { AccountComponent } from '../features/overview/pages/account/account.component';

export const remoteRoutes: Route[] = [
  {
    path: '',
    component: Root,
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
        loadChildren: () =>
          import('../features/products/products.routes').then(
            (m) => m.ProductsRoutes,
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
    ],
  },
];
