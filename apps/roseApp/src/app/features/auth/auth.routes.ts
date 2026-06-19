import { Routes } from '@angular/router';
import { AuthLayout } from '../../layouts/auth-layout/auth-layout';
import { optFlowGuard } from '../../core/guards/opt-flow-guard';
import { registerGuard } from '../../core/guards/register-guard';

export const AuthRoutes: Routes = [
  {
    path: '',
    component: AuthLayout,
     children: [
      {
        path:'',
        redirectTo: 'login',
        pathMatch : 'full'

      },
       {
        path:'send-email-verification',
       loadComponent: () =>
        import('./pages/send-email-verification/send-email-verification.component').then(
          (c)=>c.SendEmailVerificationComponent
        )
       },
       {
        path:'confirm-email-verification',
         canActivate: [optFlowGuard],
        loadComponent:() =>
          import ('./pages/confirm-email-verification/confirm-email-verification.component').then(
            (c)=>c.ConfirmEmailVerificationComponent
          )
       },
       {
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
