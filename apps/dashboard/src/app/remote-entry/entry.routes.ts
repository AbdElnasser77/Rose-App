import { Route } from '@angular/router';
import { Root } from '../core/root/root';
import { AccountComponent } from '../features/overview/pages/account/account.component';

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
