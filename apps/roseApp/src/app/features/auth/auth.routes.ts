import { Routes } from '@angular/router';
import { AuthLayout } from '../../layouts/auth-layout/auth-layout';

export const AuthRoutes: Routes = [
  {
    path: '',
    component: AuthLayout,
    // children: [
    //   {
    //     path: 'login',
    //   },
    // ],
  },
];
