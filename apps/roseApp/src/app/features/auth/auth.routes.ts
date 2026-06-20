import { Routes } from '@angular/router';
import { AuthLayout } from '../../layouts/auth-layout/auth-layout';
import { optFlowGuard } from '../../core/guards/opt-flow-guard';
import { registerGuard } from '../../core/guards/register-guard';
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
      },
      {
        path: 'reset-password', loadComponent: () => import('./pages/reset-password/reset-password.page').then((m) => m.ResetPasswordPage), title: 'Reset Password'
      },
      {
        path:'send-email-verification',
       loadComponent: () =>
        import('./pages/send-email-verification/send-email-verification.component').then(
          (c)=>c.SendEmailVerificationComponent
        )
       },{
        path:'confirm-email-verification',
         canActivate: [optFlowGuard],
        loadComponent:() =>
          import ('./pages/confirm-email-verification/confirm-email-verification.component').then(
            (c)=>c.ConfirmEmailVerificationComponent
          )
       },{
        path:'register',
        canActivate: [registerGuard],
        loadComponent: () =>
          import ('./pages/register/register.component').then(
            (c)=>c.RegisterComponent
          )

       },
    ],
  },
];
