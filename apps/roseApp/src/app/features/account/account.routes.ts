import { Routes } from '@angular/router';
import { AccountSettingsPage } from './pages/account-settings/account-settings.page';

export const accountRoutes: Routes = [
  {
    path: '',
    component: AccountSettingsPage,
    children: [
      {
        path: '',
        redirectTo: 'profile',
        pathMatch: 'full',
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('@org/auth').then((m) => m.ProfilePage),
        title: 'profile',
      },
      {
        path: 'password',
        loadComponent: () =>
          import('@org/auth').then(
            (m) => m.ChangePasswordPage
          ),
        title: 'change-password',
      },
    ],
  },
];
