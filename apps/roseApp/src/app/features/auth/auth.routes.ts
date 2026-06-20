import { Routes } from '@angular/router';
import { AuthLayout } from '../../layouts/auth-layout/auth-layout';
import { guestGuard } from '@org/auth';

export const AuthRoutes: Routes = [
  {
    path: '',
    component: AuthLayout,
    canActivate: [guestGuard],
    children: [
      {path:'', redirectTo: 'login', pathMatch: 'full'},
      {
        path: 'login', loadComponent: () => import('./pages/login/login.page').then((m) => m.LoginPage), title: 'Login'
      },
      {
        path: 'forgot-password', loadComponent: () => import('./pages/forgot-password/forgot-password.page').then((m) => m.ForgotPasswordPage), title: 'Forgot Password'
      }
    ],
  },
];
