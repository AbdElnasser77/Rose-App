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
          import('./pages/profile/profile.page').then((m) => m.ProfilePage),
        title: 'profile',
      },
      {
        path: 'password',
        loadComponent: () =>
          import('./pages/change-password/change-password.page').then(
            (m) => m.ChangePasswordPage
          ),
        title: 'change-password',
      },
    ],
  },
];
